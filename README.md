# Sistema de Préstamo de Power Banks

Aplicación web para la gestión de préstamos de Power Banks. El sistema permite administrar usuarios, dispositivos, solicitudes de préstamo, devoluciones, multas y reportes administrativos.

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- PyMySQL

### Base de Datos
- MySQL

## Estructura General

```txt
Proyecto2/
├── api_powerbank/
│   ├── app/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── schemas/
│   │   ├── service/
│   │   └── main.py
│   ├── requirements.txt
│   └── README_API.md
│
└── frontend/
    ├── css/
    ├── js/
    ├── index.html
    └── login.html
