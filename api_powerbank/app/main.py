from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import init_db
from app.controller.auth_controller import router as auth_router
from app.controller.powerbank_controller import router as powerbank_router
from app.controller.prestamo_controller import router as prestamo_router
from app.controller.report_controller import router as report_router
from app.controller.usuario_controller import router as usuario_router

app = FastAPI(title="Sistema Power Bank API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(powerbank_router)
app.include_router(prestamo_router)
app.include_router(report_router)
