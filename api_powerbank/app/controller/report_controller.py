from fastapi import APIRouter

from app.schemas.report_schema import LoanByUserReportSchema, PowerBankStatusReportSchema
from app.schemas.prestamo_schema import PrestamoSchema
from app.service.prestamo_service import PrestamoService

router = APIRouter(prefix="/reports", tags=["Reports"])
service = PrestamoService()


@router.get("/powerbanks-by-status", response_model=list[PowerBankStatusReportSchema])
def get_powerbanks_by_status():
    return service.reporte_powerbanks_por_estado()


@router.get("/loans-by-user", response_model=list[LoanByUserReportSchema])
def get_loans_by_user():
    return service.reporte_prestamos_por_usuario()


@router.get("/active-loans", response_model=list[PrestamoSchema])
def get_active_loans_report():
    return service.listar_prestamos_activos()
