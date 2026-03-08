
from pydantic import BaseModel
from typing import List, Optional

# --- Schemas de Pagamento ---

class PagamentoBase(BaseModel):
    nome_titular: str
    ultimos_digitos: str
    status: str

class PagamentoCreate(BaseModel):
    usuario_id: int
    numero_cartao: str
    nome_titular: str
    mes: int
    ano: int
    cvv: str

class Pagamento(PagamentoBase):
    id: int
    usuario_id: int

    class Config:
        orm_mode = True

# --- Schemas de Usuário ---

class UsuarioBase(BaseModel):
    nome: str
    estado_civil: str
    data_nascimento: str
    cep: str
    rua: str
    numero: str
    complemento: Optional[str] = None
    cidade: str
    estado: str

class UsuarioCreate(UsuarioBase):
    pass

class Usuario(UsuarioBase):
    id: int
    pagamentos: List[Pagamento] = []

    class Config:
        orm_mode = True
