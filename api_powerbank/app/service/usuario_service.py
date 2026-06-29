# @Authores: Carlos Ovares, Brandon Sanchez

from app.entity.usuario import UsuarioORM
from app.repository.usuario_repository import UsuarioRepository

class UsuarioService:

    def __init__(self):
        self.repo = UsuarioRepository()

    def registrar_usuario(self, usuario: UsuarioORM):
        if self.repo.get(usuario.id_usuario):
            return "Ya existe un usuario con ese ID"

        if self.repo.get_by_email(usuario.correo):
            return "Ya existe un usuario con ese correo"

        return self.repo.create(usuario)

    def listar_usuarios(self):
        return self.repo.get_all()

    def buscar_usuario(self, id_usuario: str):
        return self.repo.get(id_usuario)

    def actualizar_usuario(self, usuario: UsuarioORM):
        return self.repo.update(usuario)

    def eliminar_usuario(self, id_usuario: str):
        usuario = self.buscar_usuario(id_usuario)

        if not usuario:
            return "Usuario no encontrado"

        if usuario.rol == "Admin":
            return "No se puede eliminar un administrador"

        if usuario.multa_pendiente > 0:
            return "No se puede eliminar un usuario con multa pendiente"

        if self.repo.has_active_loans(id_usuario):
            return "No se puede eliminar un usuario con prestamo activo"

        return self.repo.delete(id_usuario)

    def validar_login(self, correo: str, password: str):
        usuario = self.repo.get_by_email(correo)

        if usuario and usuario.password == password:
            return usuario

        return None
