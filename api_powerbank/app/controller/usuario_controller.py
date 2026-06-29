# @Authores: Carlos Ovares, Brandon Sanchez

from fastapi import APIRouter, HTTPException

from app.entity.usuario import UsuarioORM
from app.schemas.usuario_schema import UsuarioSchema
from app.service.usuario_service import UsuarioService

router = APIRouter(prefix="/users", tags=["Users"])
service = UsuarioService()


@router.get("", response_model=list[UsuarioSchema])
def list_users():
    return service.listar_usuarios()


@router.post("", response_model=UsuarioSchema)
def create_user(usuario: UsuarioSchema):
    created = service.registrar_usuario(
        UsuarioORM(
            usuario.id_usuario,
            usuario.nombre,
            usuario.correo,
            usuario.telefono,
            usuario.password,
            usuario.multa_pendiente,
            usuario.rol,
        )
    )
    if isinstance(created, str):
        raise HTTPException(status_code=400, detail=created)
    return created


@router.get("/by-id/{id_usuario}", response_model=UsuarioSchema)
def get_user(id_usuario: str):
    usuario = service.buscar_usuario(id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.put("/{id_usuario}", response_model=UsuarioSchema)
def update_user(id_usuario: str, usuario: UsuarioSchema):
    updated = service.actualizar_usuario(
        UsuarioORM(
            id_usuario,
            usuario.nombre,
            usuario.correo,
            usuario.telefono,
            usuario.password,
            usuario.multa_pendiente,
            usuario.rol,
        )
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return updated


@router.delete("/{id_usuario}")
def delete_user(id_usuario: str):
    deleted = service.eliminar_usuario(id_usuario)
    if deleted == "Usuario no encontrado":
        raise HTTPException(status_code=404, detail=deleted)
    if isinstance(deleted, str):
        raise HTTPException(status_code=400, detail=deleted)
    return {"message": "Usuario eliminado correctamente"}
