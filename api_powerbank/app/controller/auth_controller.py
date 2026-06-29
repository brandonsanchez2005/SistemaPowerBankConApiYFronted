# @Authores: Carlos Ovares, Brandon Sanchez

from fastapi import APIRouter, HTTPException

from app.schemas.usuario_schema import LoginResponseSchema, LoginSchema
from app.service.usuario_service import UsuarioService

router = APIRouter(prefix="/auth", tags=["Auth"])
service = UsuarioService()


@router.post("/login", response_model=LoginResponseSchema)
def login(login_data: LoginSchema):
    usuario = service.validar_login(login_data.correo, login_data.password)

    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {
        "id_usuario": usuario.id_usuario,
        "nombre": usuario.nombre,
        "correo": usuario.correo,
        "rol": usuario.rol,
        "access_token": f"{usuario.id_usuario}:{usuario.rol}",
    }
