# @Authores: Carlos Ovares, Brandon Sanchez

from pydantic import BaseModel, ConfigDict

class UsuarioSchema(BaseModel):
    id_usuario: str
    nombre: str
    correo: str
    telefono: str
    password: str
    multa_pendiente: int = 0
    rol: str = "Usuario"

    model_config = ConfigDict(from_attributes=True)


class LoginSchema(BaseModel):
    correo: str
    password: str


class LoginResponseSchema(BaseModel):
    id_usuario: str
    nombre: str
    correo: str
    rol: str
    access_token: str
