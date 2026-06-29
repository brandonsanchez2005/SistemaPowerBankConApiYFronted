# @Authores: Carlos Ovares, Brandon Sanchez

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.config.database import Base


class PrestamoORM(Base):
    __tablename__ = "prestamos_tb"

    id_prestamo = Column(String(20), primary_key=True)
    id_usuario = Column(String(20), ForeignKey("usuarios_tb.id_usuario"), nullable=False)
    id_powerbank = Column(String(20), ForeignKey("powerbanks_tb.id_powerbank"), nullable=False)
    fecha_prestamo = Column(DateTime, nullable=False)
    fecha_devolucion = Column(DateTime, nullable=True)
    horas_limite = Column(Integer, default=2)
    multa = Column(Integer, default=0)
    estado = Column(String(20), default="Activo")

    usuario = relationship("UsuarioORM")
    powerbank = relationship("PowerBankORM")

    def __init__(
        self,
        id_prestamo,
        id_usuario,
        id_powerbank,
        fecha_prestamo,
        fecha_devolucion=None,
        horas_limite=2,
        multa=0,
        estado="Activo",
    ):
        self.id_prestamo = id_prestamo
        self.id_usuario = id_usuario
        self.id_powerbank = id_powerbank
        self.fecha_prestamo = fecha_prestamo
        self.fecha_devolucion = fecha_devolucion
        self.horas_limite = horas_limite
        self.multa = multa
        self.estado = estado

    def __repr__(self):
        return f"prestamo(ID = '{self.id_prestamo}', Usuario = '{self.id_usuario}', Estado = '{self.estado}')"
