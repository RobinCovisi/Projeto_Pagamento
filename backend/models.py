
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    estado_civil = Column(String)
    data_nascimento = Column(String)
    cep = Column(String)
    rua = Column(String)
    numero = Column(String)
    complemento = Column(String, nullable=True)
    cidade = Column(String)
    estado = Column(String)

    pagamentos = relationship("Pagamento", back_populates="usuario")

class Pagamento(Base):
    __tablename__ = "pagamentos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    nome_titular = Column(String)
    ultimos_digitos = Column(String)
    status = Column(String)

    usuario = relationship("Usuario", back_populates="pagamentos")
