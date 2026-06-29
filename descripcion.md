# Descripción del Proyecto

El Sistema de Préstamo de Power Banks es una aplicación web desarrollada para administrar el préstamo de baterías portátiles dentro de un entorno institucional. El sistema permite que los usuarios consulten los dispositivos disponibles y realicen solicitudes de préstamo, mientras que los administradores pueden gestionar usuarios, inventario, solicitudes, devoluciones y reportes.

La aplicación está compuesta por un frontend desarrollado con HTML, CSS y JavaScript, y una API backend construida con FastAPI, SQLAlchemy y MySQL. El frontend consume los servicios del backend para manejar autenticación, usuarios, power banks, préstamos y reportes administrativos.

El sistema maneja dos tipos de usuarios: administrador y usuario regular. El administrador tiene acceso completo a la gestión del sistema, mientras que el usuario regular puede consultar power banks, solicitar préstamos, revisar su perfil y verificar si posee multas pendientes.

Entre sus principales funcionalidades se encuentran el inicio de sesión, la administración de usuarios, la gestión del inventario de power banks, el flujo de solicitudes de préstamo, la aprobación o rechazo de solicitudes por parte del administrador, el registro de devoluciones, el cálculo de multas por atraso y la generación de reportes administrativos.

El proyecto busca facilitar el control ordenado de los préstamos, evitar asignaciones duplicadas, mantener actualizado el estado de cada dispositivo y brindar trazabilidad sobre el uso de los recursos.

# Resumen Importante

- El backend debe estar encendido antes de usar el frontend.
- La base de datos `powerbank_db` debe existir en MySQL.
- Las tablas se crean automáticamente al iniciar la API.
- El usuario administrador se crea automáticamente si no existe.
- El frontend consume la API desde `http://localhost:8000`.

## Usuario Administrador Por Defecto

```txt
Correo: admin@ucr.ac.cr
Contraseña: 1234
```


### Ejecutar El Backend

Entrar a la carpeta del backend:
cd api_powerbank

### Instalar dependencias:
pip install -r requirements.txt

### Ejecutar la API:
uvicorn app.main:app --reload

### Base De Datos
Crear la base de datos en MySQL:
CREATE DATABASE powerbank_db;

### La conexión se configura en:
api_powerbank/app/config/database.py
Ejemplo de conexión actual:
DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/powerbank_db"
