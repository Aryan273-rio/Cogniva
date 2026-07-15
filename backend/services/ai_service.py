import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3.5-flash")


def generate_summary(text):

    prompt = f"""
You are an AI study assistant.

Summarize the following study material.

Give:

1. Short Summary

2. Important Key Points

3. Important Definitions

4. Exam Tips

Text:

{text}
"""

    response = model.generate_content(prompt)

    return response.text