from app.config.database import SessionLocal
from app.entity.powerbank import PowerBankORM


class PowerBankRepository:

    def __init__(self):
        self.db = SessionLocal()

    def refresh_session(self):
        self.db.rollback()
        self.db.expire_all()

    def create(self, powerbank: PowerBankORM):
        self.db.add(powerbank)
        self.db.commit()
        return powerbank

    def get(self, id_powerbank: str):
        self.refresh_session()
        return self.db.query(PowerBankORM).filter_by(id_powerbank=id_powerbank).first()

    def get_all(self):
        self.refresh_session()
        return self.db.query(PowerBankORM).all()

    def get_available(self):
        self.refresh_session()
        return self.db.query(PowerBankORM).filter_by(estado="Disponible").all()

    def update(self, powerbank_up: PowerBankORM):
        powerbank = self.get(powerbank_up.id_powerbank)
        if powerbank:
            powerbank.marca = powerbank_up.marca
            powerbank.capacidad = powerbank_up.capacidad
            powerbank.estado = powerbank_up.estado
            self.db.commit()
        return powerbank

    def delete(self, id_powerbank: str):
        powerbank = self.get(id_powerbank)
        if powerbank:
            self.db.delete(powerbank)
            self.db.commit()
        return powerbank
