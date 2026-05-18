def extract_context_parts(description):
    description = description or ""

    manual_description = description
    pdf_content = ""

    marker = "CONTEÚDO EXTRAÍDO DO PDF:"

    if marker in description:
        parts = description.split(marker, 1)
        manual_description = parts[0].strip()
        pdf_content = parts[1].strip()

    return manual_description, pdf_content


def summarize_context(text):
    if not text:
        return "Nenhum conteúdo complementar foi identificado no documento enviado."

    lines = []

    for line in text.split("\n"):
        clean_line = line.strip()

        if len(clean_line) >= 25:
            lines.append(clean_line)

    selected_lines = lines[:6]

    if not selected_lines:
        return "O documento enviado foi lido, mas não apresentou trechos suficientes para resumo automático."

    summary = ""

    for line in selected_lines:
        summary += f"- {line[:180]}\n"

    return summary.strip()


def generate_document_text(client_name, document_type, description):
    manual_description, pdf_content = extract_context_parts(description)

    manual_description = (
        manual_description
        or "Nenhuma informação adicional foi fornecida manualmente."
    )

    context_summary = summarize_context(pdf_content)

    if document_type == "Contrato de Prestação de Serviços":
        return f"""
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE:
{client_name}

OBJETO DO CONTRATO:
O presente contrato tem como objetivo formalizar a prestação dos serviços descritos a seguir:

{manual_description}

INFORMAÇÕES ANALISADAS DO DOCUMENTO ANEXADO:
{context_summary}

CLÁUSULA 1 - DAS RESPONSABILIDADES:
As partes comprometem-se a cumprir as condições estabelecidas neste documento, mantendo comunicação clara, registro das informações relevantes e responsabilidade sobre os dados apresentados.

CLÁUSULA 2 - DA ORGANIZAÇÃO DAS INFORMAÇÕES:
As informações extraídas do documento anexo foram utilizadas como apoio para estruturar este contrato de forma mais clara, objetiva e padronizada.

CLÁUSULA 3 - DAS CONDIÇÕES GERAIS:
Este documento foi gerado automaticamente com base nas informações fornecidas e no conteúdo analisado, podendo ser revisado, complementado ou ajustado antes da emissão final.

ASSINATURA:
____________________________________
{client_name}
"""

    if document_type == "Declaração":
        return f"""
DECLARAÇÃO

Declaro, para os devidos fins, que as informações relacionadas a {client_name} foram registradas conforme os dados informados.

INFORMAÇÕES DECLARADAS:
{manual_description}

PONTOS IDENTIFICADOS NO DOCUMENTO ANEXADO:
{context_summary}

Com base nas informações fornecidas e no conteúdo complementar analisado, esta declaração foi estruturada automaticamente para facilitar o registro, a padronização e a conferência dos dados.

Local e data:
____________________________________

Assinatura:
____________________________________
"""

    if document_type == "Relatório Técnico":
        return f"""
RELATÓRIO TÉCNICO

Responsável/Cliente:
{client_name}

DESCRIÇÃO GERAL:
{manual_description}

PONTOS RELEVANTES IDENTIFICADOS:
{context_summary}

ANÁLISE:
Com base nas informações apresentadas manualmente e no conteúdo extraído do documento enviado, este relatório organiza os principais pontos de forma clara e estruturada, facilitando a avaliação e a tomada de decisão.

CONSIDERAÇÕES FINAIS:
Recomenda-se a revisão das informações antes da emissão final do documento, garantindo que todos os dados estejam corretos e completos.

Documento gerado automaticamente pelo DocFlow AI.
"""

    if document_type == "Notificação Extrajudicial":
        return f"""
NOTIFICAÇÃO EXTRAJUDICIAL

Notificado:
{client_name}

Prezados,

Por meio desta notificação, ficam registradas as informações apresentadas abaixo:

INFORMAÇÕES PRINCIPAIS:
{manual_description}

PONTOS DE APOIO IDENTIFICADOS NO DOCUMENTO ANEXADO:
{context_summary}

Diante dos dados apresentados, solicita-se atenção ao conteúdo desta notificação, bem como a adoção das providências cabíveis dentro do prazo aplicável.

Este documento foi gerado automaticamente com base nas informações fornecidas e deve ser revisado antes do envio definitivo.

Assinatura:
____________________________________
"""

    if document_type == "Termo de Ciência":
        return f"""
TERMO DE CIÊNCIA

Eu, {client_name}, declaro estar ciente das informações descritas neste termo.

INFORMAÇÕES APRESENTADAS:
{manual_description}

RESUMO DO DOCUMENTO ANEXADO:
{context_summary}

Declaro ainda que compreendi o conteúdo apresentado e confirmo ciência sobre os pontos informados neste documento.

Assinatura:
____________________________________
{client_name}
"""

    return f"""
DOCUMENTO GERADO AUTOMATICAMENTE

Cliente:
{client_name}

Tipo de Documento:
{document_type}

Informações fornecidas:
{manual_description}

Resumo do documento anexado:
{context_summary}

Este documento foi gerado automaticamente pelo sistema DocFlow AI.
"""