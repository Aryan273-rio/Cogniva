import fitz


def extract_text_from_pdf(pdf_bytes):

    text = ""

    document = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    for page in document:

        text += page.get_text()

    document.close()

    return text