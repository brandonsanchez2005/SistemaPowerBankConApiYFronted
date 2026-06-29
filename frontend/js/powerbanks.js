// @Authores: Carlos Ovares, Brandon Sanchez

async function cargarPowerBanks() {
    document.getElementById("tituloPagina").textContent = "Gestión de Power Banks";
    const contenedor = document.getElementById("contenido");
    const usuario = obtenerSesion();

    contenedor.innerHTML = `
        <div class="encabezado-modulo">
            <h2>Inventario de Dispositivos</h2>
            ${usuario.rol === "Admin" ? '<button class="btn btn-success" onclick="abrirModalPowerBank()"><i class="fa-solid fa-plus"></i> Agregar Batería</button>' : ''}
        </div>
        <div class="card">
            <div style="margin-bottom: 15px;">
                <input type="text" id="buscarPB" class="form-control" placeholder="Buscar por marca, capacidad o estado..." onkeyup="filtrarPowerBanks()">
            </div>
            <div class="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Marca</th>
                            <th>Capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-pb-body"></tbody>
                </table>
            </div>
        </div>
    `;
    await renderizarTablaPowerBanks();
}

async function renderizarTablaPowerBanks() {
    const tbody = document.getElementById("tabla-pb-body");
    if (!tbody) return;

    try {
        const listaPBs = await obtenerPowerBanks();
        const usuario = obtenerSesion();

        let prestamosUsuario = [];
        if (usuario && usuario.rol !== "Admin") {
            prestamosUsuario = await obtenerPrestamosUsuario(usuario.id_usuario);
        }

        tbody.innerHTML = "";

        if (listaPBs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay dispositivos registrados.</td></tr>`;
            return;
        }

        listaPBs.forEach(pb => {
            const id = pb.id_powerbank || pb.id;
            const estadoPB = pb.estado || "";
            const estadoColor = estadoPB === "Disponible" ? "#2e8b57" : (estadoPB === "Prestado" ? "#e03131" : "#f59f00");

            let botones = "";

            if (usuario.rol === "Admin") {
                botones = `
                    <button class="btn btn-warning" onclick="abrirModalPowerBank('${id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-danger" onclick="eliminarBateríaProceso('${id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
            } else {
                const solicitudMismaPB = prestamosUsuario.find(p =>
                    String(p.id_powerbank) === String(id) &&
                    String(p.estado).toLowerCase() === "pendiente"
                );

                const prestamoMismaPB = prestamosUsuario.find(p =>
                    String(p.id_powerbank) === String(id) &&
                    String(p.estado).toLowerCase() === "activo"
                );

                const tienePendiente = prestamosUsuario.some(p =>
                    String(p.estado).toLowerCase() === "pendiente"
                );

                const tieneActivo = prestamosUsuario.some(p =>
                    String(p.estado).toLowerCase() === "activo"
                );

                if (solicitudMismaPB) {
                    botones = `<button class="btn btn-secondary" disabled>Solicitado</button>`;
                } else if (prestamoMismaPB) {
                    botones = `<button class="btn btn-secondary" disabled>En préstamo</button>`;
                } else if (tienePendiente) {
                    botones = `<button class="btn btn-secondary" disabled>Ya tiene una solicitud pendiente</button>`;
                } else if (tieneActivo) {
                    botones = `<button class="btn btn-secondary" disabled>Préstamo activo</button>`;
                } else if (estadoPB === "Disponible") {
                    botones = `<button class="btn btn-primary" onclick="solicitarPrestamoInmediato('${id}')">Solicitar</button>`;
                }
            }

            tbody.innerHTML += `
                <tr>
                    <td><strong>#${id}</strong></td>
                    <td>${pb.marca}</td>
                    <td>${pb.capacidad} mAh</td>
                    <td><span style="color:${estadoColor}; font-weight:bold;">${estadoPB}</span></td>
                    <td>${botones}</td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al cargar datos.</td></tr>`;
    }
}

async function abrirModalPowerBank(id = null) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    
    let pb = { marca: "", capacidad: "", estado: "Disponible" };
    if (id) {
        const lista = await obtenerPowerBanks();
        pb = lista.find(item => String(item.id_powerbank || item.id) === String(id)) || pb;
    }

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header"><h2>${id ? 'Editar' : 'Nueva'} Batería</h2><button onclick="cerrarModal()"><i class="fa-solid fa-xmark"></i></button></div>
            <form id="form-modal-pb" onsubmit="guardarPowerBankForm(event, '${id || ''}')">
                <div class="form-group"><label>Código (ID)</label><input type="text" id="modal-id" class="form-control" value="${id || ''}" ${id ? 'disabled' : 'required'} placeholder="Ej: PB001"></div>
                <div class="form-group"><label>Marca</label><input type="text" id="modal-marca" class="form-control" value="${pb.marca}" required></div>
                <div class="form-group"><label>Capacidad (mAh)</label><input type="text" id="modal-capacidad" class="form-control" value="${pb.capacidad}" required></div>
                <div class="form-group"><label>Estado</label>
                    <select id="modal-estado" class="form-control">
                        <option value="Disponible" ${pb.estado === "Disponible" ? "selected" : ""}>Disponible</option>
                        <option value="Mantenimiento" ${pb.estado === "Mantenimiento" ? "selected" : ""}>Mantenimiento</option>
                        <option value="Prestado" ${pb.estado === "Prestado" ? "selected" : ""}>Prestado</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-success" style="width:100%">${id ? 'Actualizar' : 'Guardar'}</button>
            </form>
        </div>
    `;
}

async function guardarPowerBankForm(e, id) {
    e.preventDefault();
    const data = {
        id_powerbank: document.getElementById("modal-id").value,
        marca: document.getElementById("modal-marca").value,
        capacidad: document.getElementById("modal-capacidad").value,
        estado: document.getElementById("modal-estado").value
    };

    try {
        if (id && id !== "null" && id !== "") {
            await actualizarPowerBank(id, data);
        } else {
            await crearPowerBank(data);
        }
        cerrarModal();
        await renderizarTablaPowerBanks();
    } catch (error) { alert("Error: " + error.message); }
}

function filtrarPowerBanks() {
    const texto = document.getElementById("buscarPB").value.toLowerCase();
    document.querySelectorAll("#tabla-pb-body tr").forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(texto) ? "" : "none";
    });
}

function cerrarModal() { document.getElementById("modal").style.display = "none"; }

async function eliminarBateríaProceso(id) {
    if (confirm("¿Eliminar este dispositivo?")) {
        try { await eliminarPowerBank(id); await renderizarTablaPowerBanks(); }
        catch (e) { alert(e.message); }
    }
}

async function solicitarPrestamoInmediato(id) {
    const usuario = obtenerSesion();

    if (!usuario) {
        alert("Debes iniciar sesión para solicitar un préstamo.");
        return;
    }

    if (confirm("¿Deseas enviar una solicitud para esta Power Bank?")) {
        try {
            await crearPrestamo({
                id_prestamo: "PRE" + Date.now(),
                id_powerbank: id,
                id_usuario: usuario.id_usuario
            });

            alert("Solicitud enviada. Un administrador debe aprobarla.");
            await renderizarTablaPowerBanks();

        } catch (e) {
            alert("Error al solicitar: " + e.message);
        }
    }
}