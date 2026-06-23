from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "mysql+pymysql://root:12345@localhost:3306/powerbank_db"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


def init_db():
    from app.entity.usuario import UsuarioORM
    from app.entity.powerbank import PowerBankORM
    from app.entity.prestamo import PrestamoORM

    Base.metadata.create_all(bind=engine)
    seed_admin()


def seed_admin():
    from app.entity.usuario import UsuarioORM

    db = SessionLocal()
    admin = db.query(UsuarioORM).filter_by(id_usuario="1").first()

    if not admin:
        db.add(
            UsuarioORM(
                "1",
                "Administrador",
                "admin@ucr.ac.cr",
                "88888888",
                "1234",
                0,
                "Admin",
            )
        )
        db.commit()

    db.close()
