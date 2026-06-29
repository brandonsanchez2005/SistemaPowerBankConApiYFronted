from app.config.database import SessionLocal
from app.entity.usuario import UsuarioORM


class UsuarioRepository:

    def __init__(self):
        self.db = SessionLocal()

    def refresh_session(self):
        self.db.rollback()
        self.db.expire_all()

    def create(self, usuario: UsuarioORM):
        self.db.add(usuario)
        self.db.commit()
        return usuario

    def get(self, id_usuario: str):
        self.refresh_session()
        return self.db.query(UsuarioORM).filter_by(id_usuario=id_usuario).first()

    def get_by_email(self, correo: str):
        self.refresh_session()
        return self.db.query(UsuarioORM).filter_by(correo=correo).first()

    def get_all(self):
        self.refresh_session()
        return self.db.query(UsuarioORM).all()

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
            self.db.delete(usuario)
            self.db.commit()
        return usuario
