import json
import re

import google.generativeai as genai

from config import settings


genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_flashcards(document_text: str):

    prompt = f"""
You are an expert teacher.

Generate exactly 15 flashcards from the study material below.

Return ONLY valid JSON.

Format:

[
    {{
        "question":"...",
        "answer":"..."
    }}
]

Rules:

1. No markdown.
2. No explanation.
3. No code block.
4. Questions should cover important concepts.
5. Answers should be short (1-3 sentences).
6. Output ONLY JSON.

Study Material:

{document_text}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    text = re.sub(r"^```json", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)

    try:

        flashcards = json.loads(text)

    except Exception:

        flashcards = []

    return flashcards