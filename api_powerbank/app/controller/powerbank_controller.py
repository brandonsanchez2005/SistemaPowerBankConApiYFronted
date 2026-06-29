# @Authores: Carlos Ovares, Brandon Sanchez

from fastapi import APIRouter, HTTPException

from app.entity.powerbank import PowerBankORM
from app.schemas.powerbank_schema import PowerBankSchema
from app.service.powerbank_service import PowerBankService

router = APIRouter(prefix="/powerbanks", tags=["Power Banks"])
service = PowerBankService()


@router.get("", response_model=list[PowerBankSchema])
def list_powerbanks():
    return service.listar_powerbanks()


@router.post("", response_model=PowerBankSchema)
def create_powerbank(powerbank: PowerBankSchema):
    created = service.registrar_powerbank(
        PowerBankORM(
            powerbank.id_powerbank,
            powerbank.marca,
            powerbank.capacidad,
            powerbank.estado,
        )
    )
    if isinstance(created, str):
        raise HTTPException(status_code=400, detail=created)
    return created


@router.get("/available", response_model=list[PowerBankSchema])
def get_available_powerbanks():
    return service.obtener_disponibles()


@router.get("/by-id/{id_powerbank}", response_model=PowerBankSchema)
def get_powerbank(id_powerbank: str):
    powerbank = service.buscar_powerbank(id_powerbank)
    if not powerbank:
        raise HTTPException(status_code=404, detail="Power Bank no encontrado")
    return powerbank


@router.put("/{id_powerbank}", response_model=PowerBankSchema)
def update_powerbank(id_powerbank: str, powerbank: PowerBankSchema):
    updated = service.actualizar_powerbank(
        PowerBankORM(
            id_powerbank,
            powerbank.marca,
            powerbank.capacidad,
            powerbank.estado,
        )
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Power Bank no encontrado")
    return updated


@router.delete("/{id_powerbank}")
def delete_powerbank(id_powerbank: str):
    deleted = service.eliminar_powerbank(id_powerbank)
    if deleted == "Power Bank no encontrado":
        raise HTTPException(status_code=404, detail=deleted)
    if isinstance(deleted, str):
        raise HTTPException(status_code=400, detail=deleted)
    return {"message": "Power Bank eliminado correctamente"}
