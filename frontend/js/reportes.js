// @Authores: Carlos Ovares, Brandon Sanchez

async function cargarReportes() {
    document.getElementById("tituloPagina").textContent = "Reportes Administrativos";
    const contenedor = document.getElementById("contenido");

    contenedor.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:20px;">
            <div class="card" style="border-left:5px solid #1C7ED6;">
                <small style="color:#6c757d; font-weight:600;">Total Power Banks</small>
                <h2 id="rep-total-pb" style="margin-top:8px; color:#0F4C81;">...</h2>
            </div>

            <div class="card" style="border-left:5px solid #2e8b57;">
                <small style="color:#6c757d; font-weight:600;">Disponibles</small>
                <h2 id="rep-pb-disponibles" style="margin-top:8px; color:#2e8b57;">...</h2>
            </div>

            <div class="card" style="border-left:5px solid #f59f00;">
                <small style="color:#6c757d; font-weight:600;">Solicitudes Pendientes</small>
                <h2 id="rep-pendientes" style="margin-top:8px; color:#f59f00;">...</h2>
            </div>

            <div class="card" style="border-left:5px solid #e03131;">
                <small style="color:#6c757d; font-weight:600;">Préstamos Activos</small>
                <h2 id="rep-activos" style="margin-top:8px; color:#e03131;">...</h2>
            </div>
        </div>

        <div class="card" style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:15px; flex-wrap:wrap;">
                <div>
                    <h2 style="margin-bottom:4px;">
                        <i class="fa-solid fa-chart-column" style="color:#1C7ED6;"></i>
                        Panel de reportes
                    </h2>
                    <p style="color:#6c757d;">Consulta el estado del inventario, solicitudes y actividad de usuarios.</p>
                </div>

                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="renderizarReporte('status')">
                        <i class="fa-solid fa-battery-half"></i> Estados
                    </button>
                    <button class="btn btn-primary" onclick="renderizarReporte('active')">
                        <i class="fa-solid fa-right-left"></i> Activos
                    </button>
                    <button class="btn btn-primary" onclick="renderizarReporte('users')">
                        <i class="fa-solid fa-users"></i> Usuarios
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:15px; flex-wrap:wrap; margin-bottom:10px;">
                <h3 id="titulo-reporte-tabla">Reporte</h3>
                <span id="descripcion-reporte" style="color:#6c757d; font-size:14px;"></span>
            </div>

            <div class="tabla-container">
                <table id="tabla-reportes">
                    <thead id="thead-reportes"></thead>
                    <tbody id="tbody-reportes">
                        <tr>
                            <td style="text-align:center;">Cargando reporte...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    await cargarResumenReportes();
    await renderizarReporte("status");
}

async function cargarResumenReportes() {
    try {
        const powerbanks = await obtenerPowerBanks();
        const prestamos = await obtenerPrestamos();

        const disponibles = powerbanks.filter(pb => pb.estado === "Disponible").length;
        const pendientes = prestamos.filter(p => String(p.estado).toLowerCase() === "pendiente").length;
        const activos = prestamos.filter(p => String(p.estado).toLowerCase() === "activo").length;

        document.getElementById("rep-total-pb").textContent = powerbanks.length;
        document.getElementById("rep-pb-disponibles").textContent = disponibles;
        document.getElementById("rep-pendientes").textContent = pendientes;
        document.getElementById("rep-activos").textContent = activos;

    } catch (e) {
        document.getElementById("rep-total-pb").textContent = "Error";
        document.getElementById("rep-pb-disponibles").textContent = "Error";
        document.getElementById("rep-pendientes").textContent = "Error";
        document.getElementById("rep-activos").textContent = "Error";
    }
}

async function renderizarReporte(tipo) {
    const titulo = document.getElementById("titulo-reporte-tabla");
    const descripcion = document.getElementById("descripcion-reporte");
    const thead = document.getElementById("thead-reportes");
    const tbody = document.getElementById("tbody-reportes");

    if (!thead || !tbody) return;

    thead.innerHTML = "";
    tbody.innerHTML = `
        <tr>
            <td style="text-align:center; padding:25px;">Cargando datos...</td>
        </tr>
    `;

    try {
        let datos = [];

        if (tipo === "status") {
            titulo.textContent = "Power Banks por estado";
            descripcion.textContent = "Distribución actual del inventario.";

            datos = await reportePowerBanksEstado();

            thead.innerHTML = `
                <tr>
                    <th>Estado</th>
                    <th>Total</th>
                </tr>
            `;

            tbody.innerHTML = datos && datos.length
                ? datos.map(item => {
                    const estado = item.estado || "Sin estado";
                    const total = item.total || 0;
                    const color = obtenerColorEstado(estado);

                    return `
                        <tr>
                            <td>
                                <span style="font-weight:700; color:${color};">${estado}</span>
                            </td>
                            <td><strong>${total}</strong></td>
                        </tr>
                    `;
                }).join("")
                : filaVacia(2, "No hay datos de inventario.");

            return;
        }

        if (tipo === "active") {
            titulo.textContent = "Préstamos activos y pendientes";
            descripcion.textContent = "Seguimiento operativo de solicitudes y préstamos en curso.";

            datos = await obtenerPrestamos();

            const filtrados = datos.filter(p => {
                const estado = String(p.estado).toLowerCase();
                return estado === "activo" || estado === "pendiente";
            });

            thead.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Power Bank</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                </tr>
            `;

            tbody.innerHTML = filtrados.length
                ? filtrados.map(p => {
                    const estado = p.estado || "Sin estado";
                    const color = obtenerColorEstado(estado);

                    return `
                        <tr>
                            <td><strong>#${p.id_prestamo || p.id || "-"}</strong></td>
                            <td>${p.nombre_usuario || p.usuario || p.id_usuario || "-"}</td>
                            <td>#${p.id_powerbank || "-"}</td>
                            <td>${formatearFecha(p.fecha_prestamo || p.fecha_inicio)}</td>
                            <td><span style="font-weight:700; color:${color};">${estado}</span></td>
                        </tr>
                    `;
                }).join("")
                : filaVacia(5, "No hay préstamos activos ni solicitudes pendientes.");
            return;
        }

        if (tipo === "users") {
            titulo.textContent = "Préstamos por usuario";
            descripcion.textContent = "Actividad acumulada y multas registradas.";

            datos = await reportePrestamosUsuario();

            thead.innerHTML = `
                <tr>
                    <th>Usuario</th>
                    <th>Total préstamos</th>
                    <th>Total multas</th>
                </tr>
            `;

            tbody.innerHTML = datos && datos.length
                ? datos.map(item => {
                    const multas = item.total_multas || item.multa || 0;

                    return `
                        <tr>
                            <td>${item.nombre || item.nombre_usuario || item.usuario || item.id_usuario || "-"}</td>
                            <td><strong>${item.total_prestamos || item.total || 0}</strong></td>
                            <td>
                                ${
                                    multas > 0
                                        ? `<span style="font-weight:700; color:#e03131;">CRC ${Number(multas).toLocaleString("es-CR")}</span>`
                                        : `<span style="font-weight:700; color:#2e8b57;">Sin multas</span>`
                                }
                            </td>
                        </tr>
                    `;
                }).join("")
                : filaVacia(3, "No hay actividad de usuarios para mostrar.");
        }

    } catch (e) {
        thead.innerHTML = `
            <tr>
                <th>Error</th>
            </tr>
        `;

        tbody.innerHTML = `
            <tr>
                <td style="text-align:center; color:#e03131; padding:25px;">
                    Error al cargar datos: ${e.message}
                </td>
            </tr>
        `;
    }
}

function obtenerColorEstado(estado) {
    const estadoNormalizado = String(estado).toLowerCase();

    if (estadoNormalizado === "disponible") return "#2e8b57";
    if (estadoNormalizado === "prestado") return "#e03131";
    if (estadoNormalizado === "mantenimiento") return "#f59f00";
    if (estadoNormalizado === "pendiente") return "#f59f00";
    if (estadoNormalizado === "activo") return "#1C7ED6";
    if (estadoNormalizado === "devuelto") return "#2e8b57";
    if (estadoNormalizado === "rechazado") return "#e03131";

    return "#6c757d";
}

function filaVacia(columnas, mensaje) {
    return `
        <tr>
            <td colspan="${columnas}" style="text-align:center; padding:25px; color:#6c757d;">
                ${mensaje}
            </td>
        </tr>
    `;
}