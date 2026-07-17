import json

import google.generativeai as genai

from services.ai_service import model


def generate_quiz(text):

    prompt = f"""
You are an AI teacher.

Generate exactly 10 multiple choice questions.

Return ONLY valid JSON.

Format:

[
  {{
    "question":"",

    "options":[
      "A",
      "B",
      "C",
      "D"
    ],

    "answer":"A"
  }}
]

Study Material:

{text}
"""

    response = model.generate_content(prompt)

    quiz = response.text.strip()

    # Remove markdown if Gemini returns it
    quiz = quiz.replace("```json", "")
    quiz = quiz.replace("```", "")

    return json.loads(quiz)