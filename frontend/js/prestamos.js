// @Authores: Carlos Ovares, Brandon Sanchez

async function cargarPrestamos() {
    const usuario = obtenerSesion();

    document.getElementById("tituloPagina").textContent =
        usuario && usuario.rol === "Admin" ? "Gestión de Préstamos" : "Mis Préstamos";

    const contenedor = document.getElementById("contenido");

    contenedor.innerHTML = `
        <div class="encabezado-modulo">
            <h2>${usuario && usuario.rol === "Admin" ? "Préstamos registrados" : "Historial de préstamos"}</h2>

            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                ${
                    usuario && usuario.rol === "Admin"
                        ? `
                            <button class="btn btn-success" onclick="abrirModalPrestamo()">
                                <i class="fa-solid fa-plus"></i> Agregar Préstamo
                            </button>
                        `
                        : ""
                }
            </div>
        </div>

        <div class="card">
            <div id="mensaje"></div>

            <div class="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Power Bank</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            ${usuario && usuario.rol === "Admin" ? "<th>Acciones</th>" : ""}
                        </tr>
                    </thead>
                    <tbody id="tabla-prestamos-body">
                        <tr>
                            <td colspan="6" style="text-align:center;">Cargando préstamos...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    await renderizarTablaPrestamos();
}

async function renderizarTablaPrestamos() {
    const tbody = document.getElementById("tabla-prestamos-body");
    const usuario = obtenerSesion();

    if (!tbody || !usuario) return;

    try {
        const prestamos = usuario.rol === "Admin"
            ? await obtenerPrestamos()
            : await obtenerPrestamosUsuario(usuario.id_usuario);

        if (!prestamos || prestamos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">No hay préstamos registrados.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = prestamos.map(p => {
            const estado = p.estado || "Sin estado";
            const estadoNormalizado = estado.toLowerCase();
            const idPrestamo = p.id_prestamo || p.id;

            let colorEstado = "#6c757d";
            if (estadoNormalizado === "pendiente") colorEstado = "#f59f00";
            if (estadoNormalizado === "activo") colorEstado = "#2e8b57";
            if (estadoNormalizado === "rechazado") colorEstado = "#e03131";

            let acciones = "";

            if (usuario.rol === "Admin" && estadoNormalizado === "pendiente") {
                acciones = `
                    <button class="btn btn-success" onclick="aceptarSolicitudPrestamo('${idPrestamo}')">
                        Aceptar
                    </button>
                    <button class="btn btn-danger" onclick="rechazarSolicitudPrestamo('${idPrestamo}')">
                        Rechazar
                    </button>
                `;
            }

            if (usuario.rol === "Admin" && estadoNormalizado === "activo") {
                acciones = `
                    <button class="btn btn-danger" onclick="procesarDevolucion('${idPrestamo}')">
                        Devolver
                    </button>
                `;
            }

            return `
                <tr>
                    <td>#${idPrestamo}</td>
                    <td>${p.nombre_usuario || p.usuario || p.id_usuario || "-"}</td>
                    <td>#${p.id_powerbank || "-"}</td>
                    <td>${formatearFecha(p.fecha_prestamo || p.fecha_inicio)}</td>
                    <td>
                        <span style="font-weight:700; color:${colorEstado};">
                            ${estado}
                        </span>
                    </td>
                    ${usuario.rol === "Admin" ? `<td>${acciones}</td>` : ""}
                </tr>
            `;
        }).join("");

    } catch (e) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:red;">
                    Error al cargar: ${e.message}
                </td>
            </tr>
        `;
    }
}

async function abrirModalPrestamo() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Nuevo Préstamo</h2>
                <button onclick="cerrarModalPrestamo()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <form id="form-prestamo" onsubmit="guardarPrestamoAdmin(event)">
                <div class="form-group">
                    <label>Usuario</label>
                    <select id="prestamo-usuario" class="form-control" required>
                        <option value="">Cargando usuarios...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Power Bank disponible</label>
                    <select id="prestamo-powerbank" class="form-control" required>
                        <option value="">Cargando power banks...</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-success" style="width:100%;">
                    Guardar Préstamo
                </button>
            </form>
        </div>
    `;

    await cargarDatosModalPrestamo();
}

async function cargarDatosModalPrestamo() {
    const selectUsuario = document.getElementById("prestamo-usuario");
    const selectPowerBank = document.getElementById("prestamo-powerbank");

    try {
        const usuarios = await obtenerUsuarios();
        const disponibles = typeof obtenerDisponibles === "function"
            ? await obtenerDisponibles()
            : (await obtenerPowerBanks()).filter(pb => pb.estado === "Disponible");

        selectUsuario.innerHTML = `
            <option value="">Seleccione un usuario</option>
            ${usuarios.map(u => `
                <option value="${u.id_usuario}">
                    ${u.nombre || u.correo || u.id_usuario}
                </option>
            `).join("")}
        `;

        if (!disponibles || disponibles.length === 0) {
            selectPowerBank.innerHTML = `
                <option value="">No hay Power Banks disponibles</option>
            `;
            selectPowerBank.disabled = true;
            return;
        }

        selectPowerBank.innerHTML = `
            <option value="">Seleccione un Power Bank</option>
            ${disponibles.map(pb => `
                <option value="${pb.id_powerbank || pb.id}">
                    #${pb.id_powerbank || pb.id} - ${pb.marca || "Sin marca"} ${pb.capacidad ? `(${pb.capacidad} mAh)` : ""}
                </option>
            `).join("")}
        `;

    } catch (e) {
        selectUsuario.innerHTML = `<option value="">Error al cargar usuarios</option>`;
        selectPowerBank.innerHTML = `<option value="">Error al cargar Power Banks</option>`;
        alert("Error al cargar datos del formulario: " + e.message);
    }
}

async function guardarPrestamoAdmin(event) {
    event.preventDefault();

    const idUsuario = document.getElementById("prestamo-usuario").value;
    const idPowerBank = document.getElementById("prestamo-powerbank").value;

    if (!idUsuario || !idPowerBank) {
        alert("Debe seleccionar un usuario y un Power Bank.");
        return;
    }

    const idPrestamo = "PRE" + Date.now();

    try {
        await crearPrestamo({
            id_prestamo: idPrestamo,
            id_usuario: idUsuario,
            id_powerbank: idPowerBank
        });

        cerrarModalPrestamo();
        mostrarExito("Préstamo agregado correctamente.");
        await renderizarTablaPrestamos();

    } catch (e) {
        alert("No se pudo agregar el préstamo: " + e.message);
    }
}

async function procesarDevolucion(idPrestamo) {
    if (!confirmar("¿Deseas registrar la devolución de este préstamo?")) return;

    try {
        await devolverPrestamo(idPrestamo);
        mostrarExito("Préstamo devuelto correctamente.");
        await renderizarTablaPrestamos();
    } catch (e) {
        mostrarError("No se pudo registrar la devolución: " + e.message);
    }
}

function cerrarModalPrestamo() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    modal.innerHTML = "";
}

async function aceptarSolicitudPrestamo(idPrestamo) {
    if (!confirmar("¿Deseas aceptar esta solicitud de préstamo?")) return;

    try {
        await aceptarPrestamoApi(idPrestamo);
        mostrarExito("Solicitud aceptada correctamente.");
        await renderizarTablaPrestamos();
    } catch (e) {
        mostrarError("No se pudo aceptar la solicitud: " + e.message);
    }
}

async function rechazarSolicitudPrestamo(idPrestamo) {
    if (!confirmar("¿Deseas rechazar esta solicitud de préstamo?")) return;

    try {
        await rechazarPrestamoApi(idPrestamo);
        mostrarExito("Solicitud rechazada correctamente.");
        await renderizarTablaPrestamos();
    } catch (e) {
        mostrarError("No se pudo rechazar la solicitud: " + e.message);
    }
}