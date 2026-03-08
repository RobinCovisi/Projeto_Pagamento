
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal
from ..stripe_service import cobrar_cartao

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/pagamentos", response_model=schemas.Pagamento)
def processar_pagamento(dados: schemas.PagamentoCreate, db: Session = Depends(get_db)):
    # 1. Verifica se o usuário existe
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id == dados.usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # 2. Tenta cobrar o cartão (usando o mock)
    pagamento_stripe = cobrar_cartao(
        numero_cartao=dados.numero_cartao,
        nome_titular=dados.nome_titular,
        mes=dados.mes,
        ano=dados.ano,
        cvv=dados.cvv
    )

    # 3. Se a cobrança falhar, retorna erro
    if not pagamento_stripe:
        raise HTTPException(status_code=400, detail="Pagamento recusado pela operadora do cartão.")

    # 4. Se a cobrança for bem-sucedida, salva no banco
    novo_pagamento = models.Pagamento(
        usuario_id=dados.usuario_id,
        nome_titular=dados.nome_titular,
        ultimos_digitos=dados.numero_cartao[-4:],
        status="aprovado"
    )
    db.add(novo_pagamento)
    db.commit()
    db.refresh(novo_pagamento)

    return novo_pagamento
