from pypdf import PdfReader


def extract_pdf_text(filepath):

    text = ""

    try:

        reader = PdfReader(filepath)

        for page in reader.pages:

            extracted = page.extract_text()

            if extracted:
                text += extracted + "\n"

    except:
        pass

    return text