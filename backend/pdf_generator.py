from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib import colors


PDF_DIR = Path("generated_pdfs")
PDF_DIR.mkdir(exist_ok=True)


def wrap_text(text, max_chars=90):

    words = text.split()

    lines = []

    current_line = ""

    for word in words:

        test_line = f"{current_line} {word}".strip()

        if len(test_line) <= max_chars:

            current_line = test_line

        else:

            lines.append(current_line)

            current_line = word

    if current_line:

        lines.append(current_line)

    return lines


def create_pdf(
    process_id,
    client_name,
    document_type,
    text
):

    filename = f"documento_{process_id}.pdf"

    filepath = PDF_DIR / filename

    c = canvas.Canvas(
        str(filepath),
        pagesize=A4
    )

    width, height = A4

    # Margens estilo ABNT
    left_margin = 3 * cm
    right_margin = 2 * cm
    top_margin = height - 3 * cm
    bottom_margin = 2 * cm

    y = top_margin

    # LOGO

    logo_path = "assets/logo.png"

    try:

        c.drawImage(
            logo_path,
            left_margin,
            y - 1 * cm,
            width=4 * cm,
            height=4 * cm,
            preserveAspectRatio=True,
            mask='auto'
        )

    except:
        pass

    # CABEÇALHO

    c.setFont("Helvetica-Bold", 20)

    c.drawRightString(
        width - right_margin,
        y,
        "DocFlow AI"
    )

    c.setFont("Helvetica", 11)

    c.drawRightString(
        width - right_margin,
        y - 0.7 * cm,
        "Automação Inteligente de Documentos"
    )

    # Linha divisória

    c.setStrokeColor(colors.HexColor("#2563eb"))

    c.setLineWidth(1)

    c.line(
        left_margin,
        y - 1.5 * cm,
        width - right_margin,
        y - 1.5 * cm
    )

    y -= 3 * cm

    # TÍTULO

    c.setFont("Helvetica-Bold", 16)

    c.drawCentredString(
        width / 2,
        y,
        document_type.upper()
    )

    y -= 1.5 * cm

    # CLIENTE

    c.setFont("Helvetica-Bold", 11)

    c.drawString(
        left_margin,
        y,
        f"Cliente: {client_name}"
    )

    y -= 1.2 * cm

    # TEXTO

    c.setFont("Times-Roman", 12)

    paragraphs = text.split("\n")

    for paragraph in paragraphs:

        paragraph = paragraph.strip()

        if paragraph == "":

            y -= 0.5 * cm

            continue

        wrapped_lines = wrap_text(
            paragraph,
            max_chars=90
        )

        for line in wrapped_lines:

            if y <= bottom_margin + 5 * cm:

                c.showPage()

                y = top_margin

                c.setFont("Times-Roman", 12)

            c.drawString(
                left_margin,
                y,
                line
            )

            y -= 0.7 * cm

    # ASSINATURA

    y -= 1.5 * cm

    c.setStrokeColor(colors.black)

    c.line(
        left_margin,
        y,
        left_margin + 8 * cm,
        y
    )

    c.setFont("Helvetica", 10)

    c.drawString(
        left_margin,
        y - 0.5 * cm,
        "Responsável pelo documento"
    )

    c.drawString(
        left_margin,
        y - 1.1 * cm,
        "Documento gerado digitalmente via DocFlow AI"
    )

    # RODAPÉ

    c.setFont("Helvetica", 8)

    c.setFillColor(colors.grey)

    c.drawCentredString(
        width / 2,
        1.2 * cm,
        f"Documento gerado automaticamente • DocFlow AI • Processo #{process_id}"
    )

    c.save()

    return str(filepath)