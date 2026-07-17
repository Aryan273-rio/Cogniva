import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def ask_question(document_text, question):

    prompt = f"""
You are Cogniva AI, an intelligent study assistant.

Your task is to answer ONLY using the study material below.

If the answer is not present in the study material,
reply exactly:

"I couldn't find that information in this document."

Study Material:

{document_text}


Student Question:

{question}


Instructions:

- Answer clearly.
- Use bullet points whenever appropriate.
- Keep answers concise.
- Do not make up information.
- Do not answer from outside knowledge unless the document explicitly mentions it.
"""

    response = model.generate_content(prompt)

    return response.text