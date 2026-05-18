from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from pathlib import Path
import shutil

from database import Base, engine, SessionLocal
from models import Process
from schemas import ProcessResponse

from ai_service import generate_document_text
from document_generator import create_docx
from pdf_generator import create_pdf


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DocFlow AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def health_check():
    return {"status": "DocFlow AI rodando com sucesso"}


@app.post("/processes", response_model=ProcessResponse)
async def create_process(
    client_name: str = Form(...),
    document_type: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    uploaded_filename = None

    if file:
        uploaded_filename = file.filename
        filepath = UPLOAD_DIR / uploaded_filename

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    final_description = description or ""

    generated_text = generate_document_text(
        client_name,
        document_type,
        final_description
    )

    if uploaded_filename:
        generated_text += f"""

DOCUMENTO DE APOIO ANEXADO:
{uploaded_filename}

Observação:
O arquivo foi recebido como documento complementar para consulta, sem alterar automaticamente o conteúdo principal gerado.
"""

    process = Process(
        client_name=client_name,
        document_type=document_type,
        description=description,
        generated_text=generated_text
    )

    db.add(process)
    db.commit()
    db.refresh(process)

    return process


@app.get("/processes", response_model=list[ProcessResponse])
def list_processes(db: Session = Depends(get_db)):
    return (
        db.query(Process)
        .order_by(Process.id.desc())
        .limit(10)
        .all()
    )


@app.get("/processes/{process_id}/download")
def download_document(
    process_id: int,
    db: Session = Depends(get_db)
):
    process = db.query(Process).filter(
        Process.id == process_id
    ).first()

    if not process:
        raise HTTPException(
            status_code=404,
            detail="Processo não encontrado"
        )

    filepath = create_docx(
        process.id,
        process.client_name,
        process.document_type,
        process.generated_text
    )

    return FileResponse(
        path=filepath,
        filename=f"documento_{process.id}.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@app.get("/processes/{process_id}/download-pdf")
def download_pdf(
    process_id: int,
    db: Session = Depends(get_db)
):
    process = db.query(Process).filter(
        Process.id == process_id
    ).first()

    if not process:
        raise HTTPException(
            status_code=404,
            detail="Processo não encontrado"
        )

    filepath = create_pdf(
        process.id,
        process.client_name,
        process.document_type,
        process.generated_text
    )

    return FileResponse(
        path=filepath,
        filename=f"documento_{process.id}.pdf",
        media_type="application/pdf"
    )