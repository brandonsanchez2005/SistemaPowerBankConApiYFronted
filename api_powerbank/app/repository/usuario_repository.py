# @Authores: Carlos Ovares, Brandon Sanchez

from app.config.database import SessionLocal
from app.entity.prestamo import PrestamoORM
from app.entity.usuario import UsuarioORM


class UsuarioRepository:

    def __init__(self):
        self.db = SessionLocal()

    def create(self, usuario: UsuarioORM):
        self.db.add(usuario)
        self.db.commit()
        return usuario

    def get(self, id_usuario: str):
        return self.db.query(UsuarioORM).filter_by(id_usuario=id_usuario).first()

    def get_by_email(self, correo: str):
        return self.db.query(UsuarioORM).filter_by(correo=correo).first()

    def get_all(self):
        return self.db.query(UsuarioORM).all()

    def has_active_loans(self, id_usuario: str):
        return (
            self.db.query(PrestamoORM)
            .filter_by(id_usuario=id_usuario, estado="Activo")
            .first()
            is not None
        )

    def delete_returned_loans(self, id_usuario: str):
        loans = (
            self.db.query(PrestamoORM)
            .filter_by(id_usuario=id_usuario, estado="Devuelto")
            .all()
        )
        for loan in loans:
            self.db.delete(loan)
        self.db.commit()

    def update(self, usuario_up: UsuarioORM):
        usuario = self.get(usuario_up.id_usuario)
        if usuario:
            usuario.nombre = usuario_up.nombre
            usuario.correo = usuario_up.correo
            usuario.telefono = usuario_up.telefono
            usuario.password = usuario_up.password
            usuario.multa_pendiente = usuario_up.multa_pendiente
            usuario.rol = usuario_up.rol
            self.db.commit()
        return usuario

    def delete(self, id_usuario: str):
        usuario = self.get(id_usuario)
        if usuario:
            self.delete_returned_loans(id_usuario)
            self.db.delete(usuario)
            self.db.commit()
        return usuario
