
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routes import usuarios, pagamentos

# Cria as tabelas no banco de dados (se não existirem)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Cadastro e Pagamento",
    description="API para gerenciar o cadastro de usuários e o processamento de pagamentos.",
    version="1.0.0"
)

# Adiciona o middleware CORS para permitir requisições de qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Inclui os roteadores de usuários e pagamentos
app.include_router(usuarios.router, prefix="/api", tags=["Usuários"])
app.include_router(pagamentos.router, prefix="/api", tags=["Pagamentos"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bem-vindo à API de Cadastro e Pagamento!"}
