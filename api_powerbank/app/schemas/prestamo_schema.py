# @Authores: Carlos Ovares, Brandon Sanchez

from datetime import datetime

from pydantic import BaseModel, ConfigDict

class PrestamoSchema(BaseModel):
    id_prestamo: str
    id_usuario: str
    id_powerbank: str
    fecha_prestamo: datetime
    fecha_devolucion: datetime | None = None
    horas_limite: int = 2
    multa: int = 0
    estado: str = "Activo"

    model_config = ConfigDict(from_attributes=True)


class CrearPrestamoSchema(BaseModel):
    id_prestamo: str
    id_usuario: str
    id_powerbank: str
