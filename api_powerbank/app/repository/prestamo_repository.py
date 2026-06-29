from sqlalchemy import func

from app.config.database import SessionLocal
from app.entity.powerbank import PowerBankORM
from app.entity.prestamo import PrestamoORM
from app.entity.usuario import UsuarioORM


class PrestamoRepository:

    def __init__(self):
        self.db = SessionLocal()

    def refresh_session(self):
        self.db.rollback()
        self.db.expire_all()

    def create(self, prestamo: PrestamoORM):
        self.db.add(prestamo)
        self.db.commit()
        return prestamo

    def get(self, id_prestamo: str):
        self.refresh_session()
        return self.db.query(PrestamoORM).filter_by(id_prestamo=id_prestamo).first()

    def get_all(self):
        self.refresh_session()
        return self.db.query(PrestamoORM).all()

    def get_by_user(self, id_usuario: str):
        self.refresh_session()
        return self.db.query(PrestamoORM).filter_by(id_usuario=id_usuario).all()

    def get_active_by_user(self, id_usuario: str):
        self.refresh_session()
        return (
            self.db.query(PrestamoORM)
            .filter_by(id_usuario=id_usuario, estado="Activo")
            .first()
        )

    def get_active(self):
        self.refresh_session()
        return self.db.query(PrestamoORM).filter_by(estado="Activo").all()

    def get_user(self, id_usuario: str):
        self.refresh_session()
        return self.db.query(UsuarioORM).filter_by(id_usuario=id_usuario).first()

    def get_powerbank(self, id_powerbank: str):
        self.refresh_session()
        return self.db.query(PowerBankORM).filter_by(id_powerbank=id_powerbank).first()

    def update(self, prestamo: PrestamoORM):
        self.db.commit()
        return prestamo

    def powerbanks_by_status(self):
        self.refresh_session()
        return (
            self.db.query(PowerBankORM.estado, func.count(PowerBankORM.id_powerbank))
            .group_by(PowerBankORM.estado)
            .all()
        )

    def loans_by_user(self):
        self.refresh_session()
        return (
            self.db.query(
                UsuarioORM.id_usuario,
                UsuarioORM.nombre,
                func.count(PrestamoORM.id_prestamo).label("total_prestamos"),
                func.coalesce(func.sum(PrestamoORM.multa), 0).label("total_multas"),
            )
            .join(PrestamoORM, PrestamoORM.id_usuario == UsuarioORM.id_usuario)
            .group_by(UsuarioORM.id_usuario, UsuarioORM.nombre)
            .all()
        )
