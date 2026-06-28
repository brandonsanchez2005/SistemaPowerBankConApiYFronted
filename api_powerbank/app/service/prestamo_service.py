from datetime import datetime

from app.entity.prestamo import PrestamoORM
from app.repository.prestamo_repository import PrestamoRepository


class PrestamoService:

    def __init__(self):
        self.repo = PrestamoRepository()

    def realizar_prestamo(self, id_prestamo: str, id_usuario: str, id_powerbank: str):
        id_prestamo = str(id_prestamo).strip()
        id_usuario = str(id_usuario).strip()
        id_powerbank = str(id_powerbank).strip()

        if self.repo.get(id_prestamo):
            return "Ya existe un prestamo con ese ID"

        usuario = self.repo.get_user(id_usuario)
        if not usuario:
            return "Usuario no encontrado"

        powerbank = self.repo.get_powerbank(id_powerbank)
        if not powerbank:
            return "Power Bank no encontrado"

        if powerbank.estado != "Disponible":
            return "Power Bank no disponible"

        if self.repo.get_active_by_user(id_usuario):
            return "El usuario ya tiene un prestamo activo"

        prestamo = PrestamoORM(
            id_prestamo,
            id_usuario,
            id_powerbank,
            datetime.now(),
            None,
            2,
            0,
            "Activo",
        )

        powerbank.estado = "Prestado"
        self.repo.create(prestamo)
        return prestamo

    def realizar_devolucion(self, id_prestamo: str):
        prestamo = self.repo.get(id_prestamo)

        if not prestamo:
            return "Prestamo no encontrado"

        if prestamo.estado == "Devuelto":
            return "El prestamo ya fue devuelto"

        fecha_devolucion = datetime.now()
        horas = (fecha_devolucion - prestamo.fecha_prestamo).total_seconds() / 3600
        multa = 0

        if horas > prestamo.horas_limite:
            horas_extra = int(horas - prestamo.horas_limite)
            multa = horas_extra * 500

        prestamo.fecha_devolucion = fecha_devolucion
        prestamo.multa = multa
        prestamo.estado = "Devuelto"

        powerbank = self.repo.get_powerbank(prestamo.id_powerbank)
        if powerbank:
            powerbank.estado = "Disponible"

        usuario = self.repo.get_user(prestamo.id_usuario)
        if usuario:
            usuario.multa_pendiente += multa

        self.repo.update(prestamo)
        return prestamo

    def listar_prestamos(self):
        return self.repo.get_all()

    def buscar_prestamos_usuario(self, id_usuario: str):
        return self.repo.get_by_user(id_usuario)

    def listar_prestamos_activos(self):
        return self.repo.get_active()

    def reporte_powerbanks_por_estado(self):
        rows = self.repo.powerbanks_by_status()
        return [{"estado": row[0], "total": row[1]} for row in rows]

    def reporte_prestamos_por_usuario(self):
        rows = self.repo.loans_by_user()
        return [
            {
                "id_usuario": row.id_usuario,
                "nombre": row.nombre,
                "total_prestamos": row.total_prestamos,
                "total_multas": row.total_multas,
            }
            for row in rows
        ]
