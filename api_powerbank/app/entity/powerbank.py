# @Authores: Carlos Ovares, Brandon Sanchez

from sqlalchemy import Column, String

from app.config.database import Base


class PowerBankORM(Base):
    __tablename__ = "powerbanks_tb"

    id_powerbank = Column(String(20), primary_key=True)
    marca = Column(String(80), nullable=False)
    capacidad = Column(String(40), nullable=False)
    estado = Column(String(20), nullable=False)

    def __init__(self, id_powerbank, marca, capacidad, estado="Disponible"):
        self.id_powerbank = id_powerbank
        self.marca = marca
        self.capacidad = capacidad
        self.estado = estado

    def __repr__(self):
        return f"powerbank(ID = '{self.id_powerbank}', Marca = '{self.marca}', Estado = '{self.estado}')"
