from app.entity.powerbank import PowerBankORM
from app.repository.powerbank_repository import PowerBankRepository


class PowerBankService:

    def __init__(self):
        self.repo = PowerBankRepository()

    def registrar_powerbank(self, powerbank: PowerBankORM):
        if self.repo.get(powerbank.id_powerbank):
            return "Ya existe un Power Bank con ese ID"

        return self.repo.create(powerbank)

    def listar_powerbanks(self):
        return self.repo.get_all()

    def buscar_powerbank(self, id_powerbank: str):
        return self.repo.get(id_powerbank)

    def obtener_disponibles(self):
        return self.repo.get_available()

    def actualizar_powerbank(self, powerbank: PowerBankORM):
        return self.repo.update(powerbank)

    def eliminar_powerbank(self, id_powerbank: str):
        powerbank = self.buscar_powerbank(id_powerbank)

        if not powerbank:
            return "Power Bank no encontrado"

        if powerbank.estado != "Disponible":
            return "No se puede eliminar un Power Bank prestado"

        if self.repo.has_active_loans(id_powerbank):
            return "No se puede eliminar un Power Bank con prestamo activo"

        return self.repo.delete(id_powerbank)
