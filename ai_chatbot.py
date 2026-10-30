import os
import json
import urllib.request
import urllib.parse
import urllib.error
from dotenv import load_dotenv

# Ensure environment variables from root or backend .env are loaded
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
backend_env = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(root_env):
    load_dotenv(root_env)
elif os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

def call_gemini_api(user_message: str, user_skills: list = None, target_role: str = "", conversation_history: list = None, api_key: str = "") -> dict:
    """
    Direct HTTP REST call to Google Gemini API (gemini-2.5-flash / gemini-1.5-flash) using GEMINI_API_KEY.
    NEVER exposes the key in frontend/browser code.
    Handles rate limits, invalid keys, quota limits, timeouts, and network exceptions cleanly.
    """
    key_to_use = api_key or os.environ.get("GEMINI_API_KEY", "") or GEMINI_API_KEY
    if not key_to_use:
        return {
            "success": False,
            "error": "No GEMINI_API_KEY found in server environment variables. Please configure GEMINI_API_KEY in server .env file.",
            "reply": None
        }

    user_skills = user_skills or []
    skills_str = ", ".join(user_skills) if user_skills else "JavaScript, React, Python, Java, SQL"
    role_str = target_role or "Software Engineer / Data Analyst / Tech Industry"

    system_instruction_text = (
        "You are an expert AI Career Coach, Resume Strategist, Skill Gap Analyst, and Technical Interview Advisor on Skill Match AI.\n"
        f"Candidate Active Skills: {skills_str}\n"
        f"Target Role: {role_str}\n\n"
        "Your role is to answer candidate questions dynamically and professionally about jobs, careers, resumes, skills, skill gaps, programming, Java development, technical interviews, and career guidance.\n"
        "Format responses in clean Markdown with bullet points, bold highlights, code snippets (if relevant), and actionable tips."
    )

    contents_payload = []

    # Include multi-turn conversation history
    if conversation_history and isinstance(conversation_history, list):
        for msg in conversation_history[-6:]:
            sender = msg.get("sender") or msg.get("role")
            role = "user" if sender == "user" else "model"
            text = msg.get("text") or msg.get("content", "")
            if text and not text.startswith("⚠️") and not text.startswith("Hello"):
                contents_payload.append({
                    "role": role,
                    "parts": [{"text": text}]
                })

    contents_payload.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })

    request_body = {
        "system_instruction": {
            "parts": [{"text": system_instruction_text}]
        },
        "contents": contents_payload
    }

    # Try gemini-2.5-flash first, fallback to gemini-1.5-flash
    for model_name in ["gemini-2.5-flash", "gemini-1.5-flash"]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key_to_use.strip()}"
            payload = json.dumps(request_body).encode('utf-8')

            req = urllib.request.Request(
                url,
                data=payload,
                headers={"Content-Type": "application/json"}
            )

            with urllib.request.urlopen(req, timeout=30) as response:
                res = json.loads(response.read().decode('utf-8'))
                candidates = res.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        reply_text = parts[0].get('text', '').strip()
                        if reply_text:
                            return {
                                "success": True,
                                "reply": f"✨ **Powered by Google Gemini 2.5 Flash AI**\n\n{reply_text}",
                                "model": model_name,
                                "error": None
                            }
        except urllib.error.HTTPError as e:
            err_body = ""
            try:
                err_body = e.read().decode('utf-8')
            except Exception:
                pass

            if e.code in [400, 401, 403]:
                return {
                    "success": False,
                    "error": f"Invalid Gemini API Key (HTTP {e.code}). Please verify your GEMINI_API_KEY in server .env.",
                    "reply": None
                }
            elif e.code == 429:
                return {
                    "success": False,
                    "error": "Google Gemini API Quota or Rate Limit Exceeded (HTTP 429). Please try again in a moment.",
                    "reply": None
                }
            elif e.code == 404:
                continue
            else:
                return {
                    "success": False,
                    "error": f"Google Gemini API Error (HTTP {e.code}): {err_body or str(e)}",
                    "reply": None
                }
        except urllib.error.URLError as e:
            return {
                "success": False,
                "error": f"Network connection error connecting to Google Gemini API: {str(e.reason)}",
                "reply": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected Gemini connection exception: {str(e)}",
                "reply": None
            }

    return {
        "success": False,
        "error": "Unable to receive response from Google Gemini API.",
        "reply": None
    }


def generate_chatbot_response(user_message: str, user_skills: list = None, target_role: str = "", conversation_history: list = None, api_key: str = "") -> dict:
    user_skills = user_skills or []
    
    suggested_prompts = []

    gemini_res = call_gemini_api(
        user_message=user_message,
        user_skills=user_skills,
        target_role=target_role,
        conversation_history=conversation_history,
        api_key=api_key
    )

    if gemini_res.get("success"):
        return {
            "category": "gemini_ai",
            "reply": gemini_res["reply"],
            "suggested_prompts": [],
            "error": None
        }

    err_detail = gemini_res.get("error", "Google Gemini service offline.")
    return {
        "category": "gemini_error",
        "reply": f"⚠️ **Google Gemini AI Error**: {err_detail}",
        "suggested_prompts": [],
        "error": err_detail
    }

