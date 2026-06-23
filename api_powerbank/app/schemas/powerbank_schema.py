from pydantic import BaseModel, ConfigDict


class PowerBankSchema(BaseModel):
    id_powerbank: str
    marca: str
    capacidad: str
    estado: str = "Disponible"

    model_config = ConfigDict(from_attributes=True)
