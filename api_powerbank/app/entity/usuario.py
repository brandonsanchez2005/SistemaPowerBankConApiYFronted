from sqlalchemy import Column, Integer, String

from app.config.database import Base


class UsuarioORM(Base):
    __tablename__ = "usuarios_tb"

    id_usuario = Column(String(20), primary_key=True)
    nombre = Column(String(80), nullable=False)
    correo = Column(String(100), nullable=False, unique=True)
    telefono = Column(String(20), nullable=False)
    password = Column(String(80), nullable=False)
    multa_pendiente = Column(Integer, default=0)
    rol = Column(String(20), default="Usuario")

    def __init__(
        self,
        id_usuario,
        nombre,
        correo,
        telefono,
        password,
        multa_pendiente=0,
        rol="Usuario",
    ):
        self.id_usuario = id_usuario
        self.nombre = nombre
        self.correo = correo
        self.telefono = telefono
        self.password = password
        self.multa_pendiente = multa_pendiente
        self.rol = rol

    def __repr__(self):
        return f"usuario(ID = '{self.id_usuario}', Nombre = '{self.nombre}', Rol = '{self.rol}')"
