from fastapi import APIRouter, HTTPException

from app.schemas.prestamo_schema import CrearPrestamoSchema, PrestamoSchema
from app.service.prestamo_service import PrestamoService

router = APIRouter(prefix="/loans", tags=["Loans"])
service = PrestamoService()


@router.get("", response_model=list[PrestamoSchema])
def list_loans():
    return service.listar_prestamos()


@router.post("", response_model=PrestamoSchema)
def create_loan(prestamo: CrearPrestamoSchema):
    created = service.realizar_prestamo(
        prestamo.id_prestamo,
        prestamo.id_usuario,
        prestamo.id_powerbank,
    )
    if created in ["Usuario no encontrado", "Power Bank no encontrado"]:
        raise HTTPException(status_code=404, detail=created)
    if isinstance(created, str):
        raise HTTPException(status_code=400, detail=created)
    return created


@router.put("/accept/{id_prestamo}", response_model=PrestamoSchema)
def accept_loan(id_prestamo: str):
    accepted = service.aceptar_prestamo(id_prestamo)
    if accepted == "Prestamo no encontrado":
        raise HTTPException(status_code=404, detail=accepted)
    if isinstance(accepted, str):
        raise HTTPException(status_code=400, detail=accepted)
    return accepted


@router.put("/reject/{id_prestamo}", response_model=PrestamoSchema)
def reject_loan(id_prestamo: str):
    rejected = service.rechazar_prestamo(id_prestamo)
    if rejected == "Prestamo no encontrado":
        raise HTTPException(status_code=404, detail=rejected)
    if isinstance(rejected, str):
        raise HTTPException(status_code=400, detail=rejected)
    return rejected


@router.put("/return/{id_prestamo}", response_model=PrestamoSchema)
def return_loan(id_prestamo: str):
    returned = service.realizar_devolucion(id_prestamo)
    if returned == "Prestamo no encontrado":
        raise HTTPException(status_code=404, detail=returned)
    if isinstance(returned, str):
        raise HTTPException(status_code=400, detail=returned)
    return returned


@router.get("/by-user/{id_usuario}", response_model=list[PrestamoSchema])
def get_loans_by_user(id_usuario: str):
    return service.buscar_prestamos_usuario(id_usuario)


@router.get("/active", response_model=list[PrestamoSchema])
def get_active_loans():
    return service.listar_prestamos_activos()