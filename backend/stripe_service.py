import random

def cobrar_cartao(numero_cartao: str, nome_titular: str, mes: int, ano: int, cvv: str):
    """
    Função mock para simular a cobrança de um cartão de crédito.
    Em um cenário real, aqui seria a integração com a API da Stripe.
    """
    # Lógica de simulação simples:
    # - Recusa cartões terminados em "0"
    # - Recusa se o CVV for "000"
    if numero_cartao.endswith("0") or cvv == "000":
        return None

    return {
        "id": f"ch_{random.randint(1000, 9999)}",
        "status": "succeeded",
        "amount": 1000, # Valor fixo de R$10,00
        "currency": "brl"
    }
