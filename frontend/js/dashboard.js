// @Authores: Carlos Ovares, Brandon Sanchez

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema() {
    verificarSesion();
    mostrarNombreUsuario();
    aplicarPermisosMenu();
    configurarMenu();

    const usuario = obtenerSesion();
    if (usuario && usuario.rol === "Admin") {
        cargarDashboard(); 
    } else {
        cargarVistaPrincipalUsuario();
    }
}

function mostrarNombreUsuario() {
    const usuario = obtenerSesion();
    if (!usuario) return;
    document.getElementById("nombreUsuario").textContent = usuario.nombre;
}

function aplicarPermisosMenu() {
    const usuario = obtenerSesion();
    if (!usuario) return;

    const txtInicio = document.querySelector("#menuDashboard");
    
    if (usuario.rol === "Admin") {
        if (txtInicio) txtInicio.innerHTML = `<i class="fa-solid fa-house"></i> Dashboard`;
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "block");
        document.querySelectorAll(".user-only").forEach(el => el.style.display = "none");
    } else {
        if (txtInicio) txtInicio.innerHTML = `<i class="fa-solid fa-house"></i> Principal`;
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
        document.querySelectorAll(".user-only").forEach(el => el.style.display = "block");
    }
}

function configurarMenu() {
    document.getElementById("menuDashboard").addEventListener("click", (e) => {
        e.preventDefault();
        const usuario = obtenerSesion();
        if (usuario && usuario.rol === "Admin") {
            cargarDashboard();
        } else {
            cargarVistaPrincipalUsuario();
        }
    });

    const btnUsuarios = document.getElementById("menuUsuarios");
    if (btnUsuarios) {
        btnUsuarios.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof cargarUsuarios === "function") cargarUsuarios();
        });
    }

    const btnPerfil = document.getElementById("menuPerfil");
    if (btnPerfil) {
        btnPerfil.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof cargarMiPerfil === "function") cargarMiPerfil();
        });
    }

    document.getElementById("menuPowerBanks").addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof cargarPowerBanks === "function") cargarPowerBanks();
    });

    document.getElementById("menuPrestamos").addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Intentando cargar préstamos...");
        if (typeof cargarPrestamos === "function") {
            cargarPrestamos();
        } else {
            console.error("La función cargarPrestamos NO está definida en el contexto global.");
        }
    });

    const btnReportes = document.getElementById("menuReportes");
    if (btnReportes) {
        btnReportes.addEventListener("click", (e) => {
            e.preventDefault();
            cargarReportes();
        });
    }
}

/**
 * VISTA PARA ADMINISTRADORES
 */
async function cargarDashboard() {
    document.getElementById("tituloPagina").textContent = "Dashboard de Administración";
    const contenedor = document.getElementById("contenido");

    contenedor.innerHTML = `
        <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 20px;">
            
            <div class="card" style="border-left: 5px solid #3498db;">
                <h3><i class="fa-solid fa-users" style="color: #3498db;"></i> Usuarios Registrados</h3>
                <p id="dash-usuarios" style="font-size: 2.2rem; font-weight: 700; margin-top: 10px; color: var(--text-color);">...</p>
                <span style="font-size: 0.85rem; color: #7f8c8d;">Total de cuentas en el sistema</span>
            </div>

            <div class="card" style="border-left: 5px solid var(--primary-color);">
                <h3><i class="fa-solid fa-battery-three-quarters" style="color: var(--primary-color);"></i> Total Power Banks</h3>
                <p id="dash-pb" style="font-size: 2.2rem; font-weight: 700; margin-top: 10px; color: var(--text-color);">...</p>
                <span id="dash-pb-disponibles" style="font-size: 0.85rem; color: #27ae60; font-weight: 500;">Disponibles: ...</span>
            </div>

            <div class="card" style="border-left: 5px solid #2ec4b6;">
                <h3><i class="fa-solid fa-right-left" style="color: #2ec4b6;"></i> Préstamos Activos</h3>
                <p id="dash-prestamos" style="font-size: 2.2rem; font-weight: 700; margin-top: 10px; color: var(--text-color);">...</p>
                <span style="font-size: 0.85rem; color: #7f8c8d;">Dispositivos entregados hoy</span>
            </div>

        </div>

        <div class="dashboard-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-top: 20px;">
            
            <div class="card">
                <h2><i class="fa-solid fa-circle-info" style="color: var(--primary-color);"></i> Estado Operativo del Sistema</h2>
                <p style="margin-top: 10px; line-height: 1.6;">
                    El panel recopila información en tiempo real desde la API del servidor. Como administrador, cuentas con acceso completo para auditar el flujo de dispositivos y sancionar retrasos.
                </p>
                <div style="margin-top: 15px; padding: 10px; background-color: rgba(46, 196, 182, 0.1); border-radius: 8px; border-left: 4px solid #2ec4b6;">
                    <small style="color: #16a085; font-weight: 600; display: block;">💡 Consejo rápido:</small>
                    <small style="color: var(--text-color);">Revisa el módulo de <b>Reportes</b> al final del día para analizar cuáles marcas presentan mayor demanda por parte de la comunidad.</small>
                </div>
            </div>

            <div class="card">
                <h2><i class="fa-solid fa-clock-history"></i> Resumen del Inventario</h2>
                <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                        <span>Dispositivos en Mantenimiento:</span>
                        <strong id="dash-pb-mantenimiento" style="color: #e67e22;">...</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                        <span>Dispositivos Prestados:</span>
                        <strong id="dash-pb-prestados" style="color: #e74c3c;">...</strong>
                    </div>
                </div>
            </div>

        </div>
    `;

    try {

        if (typeof obtenerUsuarios === "function") {
            const listaUsuarios = await obtenerUsuarios();
            document.getElementById("dash-usuarios").textContent = listaUsuarios.length;
        } else {
            document.getElementById("dash-usuarios").textContent = "0";
        }

        if (typeof obtenerPowerBanks === "function") {
            const listaPBs = await obtenerPowerBanks();
            document.getElementById("dash-pb").textContent = listaPBs.length;

            const disponibles = listaPBs.filter(pb => pb.estado === "Disponible" || pb.estado === "disponible").length;
            const mantenimiento = listaPBs.filter(pb => pb.estado === "Mantenimiento" || pb.estado === "mantenimiento").length;
            const prestados = listaPBs.filter(pb => pb.estado === "Prestado" || pb.estado === "prestado").length;

            document.getElementById("dash-pb-disponibles").textContent = `Disponibles para entrega: ${disponibles}`;
            document.getElementById("dash-pb-mantenimiento").textContent = mantenimiento;
            document.getElementById("dash-pb-prestados").textContent = prestados;
        } else {
            document.getElementById("dash-pb").textContent = "0";
            document.getElementById("dash-pb-disponibles").textContent = "Disponibles: 0";
            document.getElementById("dash-pb-mantenimiento").textContent = "0";
            document.getElementById("dash-pb-prestados").textContent = "0";
        }

        if (typeof obtenerPrestamosActivos === "function") {
            const listaPrestamos = await obtenerPrestamosActivos();
            document.getElementById("dash-prestamos").textContent = listaPrestamos.length;
        } else {
            document.getElementById("dash-prestamos").textContent = "0";
        }

    } catch (error) {
        console.error("Error al cargar los datos avanzados del dashboard:", error);
        if (typeof mostrarError === "function") {
            mostrarError("No se pudieron sincronizar las métricas con el servidor.");
        }

        document.getElementById("dash-usuarios").textContent = "Error";
        document.getElementById("dash-pb").textContent = "Error";
        document.getElementById("dash-prestamos").textContent = "Error";
    }
}

/**
 * VISTA PARA USUARIOS
 */
function cargarVistaPrincipalUsuario() {
    const usuario = obtenerSesion();
    document.getElementById("tituloPagina").textContent = "Inicio Principal";
    
    const contenedor = document.getElementById("contenido");

    contenedor.innerHTML = `
        <div class="card" style="margin-top: 20px;">
            <h2>¡Hola, ${usuario ? usuario.nombre : "Estudiante"}! Bienvenido al Sistema</h2>
            <p>Este portal te permite solicitar baterías portátiles (Power Banks) para tus dispositivos en públicos estrategicos.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
            <div class="card">
                <h3><i class="fa-solid fa-circle-info" style="color: var(--primary-color);"></i> ¿Cómo funciona el préstamo?</h3>
                <ul style="margin-top: 10px; padding-left: 20px; line-height: 1.6;">
                    <li>Dirígete a la sección de <b>Power Banks</b> para revisar los dispositivos disponibles.</li>
                    <li>Solicita el préstamo indicando la duración necesaria del dispositivo.</li>
                    <li>Puedes verificar tus préstamos en curso e historial desde la pestaña de <b>Mi Perfil</b>.</li>
                </ul>
            </div>

            <div class="card">
                <h3><i class="fa-solid fa-gavel" style="color: #e74c3c;"></i> Reglamento y Multas</h3>
                <ul style="margin-top: 10px; padding-left: 20px; line-height: 1.6;">
                    <li>El tiempo máximo por préstamo continuo es de <b>2 horas</b>.</li>
                    <li>La entrega tardía generará una multa automática en tu cuenta que congelará nuevos préstamos.</li>
                </ul>
            </div>
        </div>

        <div class="card" style="margin-top: 20px; text-align: center; border-left: 5px solid #2ec4b6;">
            <p>💡 <b>¿Necesitas carga de inmediato?</b> Ve a la pestaña de <b>Power Banks</b> para ver qué marcas y capacidades tenemos listas para entregar hoy.</p>
        </div>
    `;
}