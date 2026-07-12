from io import BytesIO

from pypdf import PdfReader


def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text content from a PDF file."""
    reader = PdfReader(BytesIO(file_content))
    text_parts: list[str] = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text.strip())

    text = "\n\n".join(text_parts).strip()
    if not text:
        raise ValueError("Could not extract text from PDF. The file may be scanned or empty.")
    return text
