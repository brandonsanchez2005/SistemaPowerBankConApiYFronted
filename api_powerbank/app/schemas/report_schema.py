from pydantic import BaseModel


class PowerBankStatusReportSchema(BaseModel):
    estado: str
    total: int


class LoanByUserReportSchema(BaseModel):
    id_usuario: str
    nombre: str
    total_prestamos: int
    total_multas: int
