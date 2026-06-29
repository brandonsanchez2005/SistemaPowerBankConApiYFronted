// @Authores: Carlos Ovares, Brandon Sanchez

async function cargarUsuarios() {
    document.getElementById("tituloPagina").textContent = "Gestión de Usuarios";
    const contenedor = document.getElementById("contenido");

    contenedor.innerHTML = `
        <div class="encabezado-modulo">
            <h2>Cuentas Registradas</h2>
            <button class="btn btn-success" onclick="abrirModalUsuario()"><i class="fa-solid fa-plus"></i> Nuevo Usuario</button>
        </div>

        <div class="card">
            <div style="margin-bottom: 15px;">
                <input type="text" id="buscarUsuario" class="form-control" placeholder="Buscar por nombre, correo o teléfono..." onkeyup="filtrarUsuarios()">
            </div>
            
            <div class="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Multa</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-usuarios-body">
                    
                        </tbody>
                </table>
            </div>
        </div>
    `;

    await renderizarTablaUsuarios();
}

async function renderizarTablaUsuarios() {
    const tbody = document.getElementById("tabla-usuarios-body");
    if (!tbody) return;

    try {
        const listaUsuarios = await obtenerUsuarios(); 
        tbody.innerHTML = "";

        if (listaUsuarios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay usuarios registrados.</td></tr>`;
            return;
        }

        listaUsuarios.forEach(u => {
            const idReal = u.id_usuario || u.id;
            
            let multaTexto = "Sin multas";
            let multaColor = "#2e8b57";
            if (u.multa_pendiente && parseFloat(u.multa_pendiente) > 0) {
                multaTexto = `₡${parseFloat(u.multa_pendiente).toLocaleString("es-CR")}`;
                multaColor = "#e03131";
            }

            const rolVisual = u.rol === "Admin" ? "Admin" : "Usuario";

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>#${idReal}</strong></td>
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.telefono || "-"}</td>
                <td><span class="badge" style="background: #0f4c811a; color: #0F4C81; padding: 3px 8px; border-radius: 8px; font-weight: 600;">${rolVisual}</span></td>
                <td><span style="color: ${multaColor}; font-weight: bold;">${multaTexto}</span></td>
                <td>
                    <div class="acciones">
                        <button class="btn btn-warning" style="padding: 6px 12px; font-size: 13px;" onclick="abrirModalUsuario('${idReal}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 13px;" onclick="eliminarUsuarioProceso('${idReal}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">Error al cargar los usuarios.</td></tr>`;
    }
}

function filtrarUsuarios() {
    const texto = document.getElementById("buscarUsuario").value.toLowerCase();
    const filas = document.querySelectorAll("#tabla-usuarios-body tr");

    filas.forEach(fila => {
        if (fila.textContent.toLowerCase().includes(texto)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

async function abrirModalUsuario(id = null) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    let titulo = "Registrar Nuevo Usuario";
    let idInputHTML = ""; 
    let nombre = "";
    let correo = "";
    let telefono = "";
    let password = "";
    let rol = "Usuario";
    let multaPendiente = "0";
    let botonSubmitText = "Guardar Usuario";

    try {
        const lista = await obtenerUsuarios();

        if (id) {
            titulo = "Editar Usuario";
            botonSubmitText = "Actualizar Cambios";
            idInputHTML = `
                <div class="form-group">
                    <label>ID de Usuario (No editable)</label>
                    <input type="text" id="modal-id" class="form-control" value="${id}" disabled style="background: #e5e7eb; cursor: not-allowed;">
                </div>
            `;
            const u = lista.find(item => String(item.id_usuario || item.id) === String(id));
            if (u) {
                nombre = u.nombre;
                correo = u.correo;
                telefono = u.telefono || "";
                password = u.password || "";
                rol = u.rol === "Admin" ? "Admin" : "Usuario";
                multaPendiente = u.multa_pendiente || "0";
            }
        } else {
            let maxId = 0;
            lista.forEach(item => {
                const currentId = parseInt(item.id_usuario || item.id, 10);
                if (!isNaN(currentId) && currentId > maxId) {
                    maxId = currentId;
                }
            });
            const idSecuencial = maxId + 1;
            idInputHTML = `<input type="hidden" id="modal-id" value="${idSecuencial}">`;
        }
    } catch (e) {
        console.error("Error al procesar los IDs de usuarios:", e);
    }

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button onclick="cerrarModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="form-modal-usuario" onsubmit="guardarUsuarioForm(event, ${id ? `'${id}'` : 'null'})">
                
                ${idInputHTML}

                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" id="modal-nombre" class="form-control" value="${nombre}" required>
                </div>
                <div class="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" id="modal-correo" class="form-control" value="${correo}" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" id="modal-telefono" class="form-control" value="${telefono}">
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" id="modal-password" class="form-control" value="${password}" placeholder="${id ? 'Dejar igual o cambiar' : 'Asigne una contraseña'}" ${id ? '' : 'required'}>
                </div>
                <div class="form-group">
                    <label>Rol del Sistema</label>
                    <select id="modal-rol" class="form-control">
                        <option value="Usuario" ${rol === "Usuario" ? "selected" : ""}>Usuario</option>
                        <option value="Admin" ${rol === "Admin" ? "selected" : ""}>Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Multa acumulada (₡)</label>
                    <input type="number" id="modal-multa" class="form-control" value="${multaPendiente}">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal()">Cancelar</button>
                    <button type="submit" class="btn btn-success">${botonSubmitText}</button>
                </div>
            </form>
        </div>
    `;
}

async function guardarUsuarioForm(e, id) {
    e.preventDefault();
    
    const idUsuario = document.getElementById("modal-id").value.trim();
    const nombre = document.getElementById("modal-nombre").value.trim();
    const correo = document.getElementById("modal-correo").value.trim();
    const telefono = document.getElementById("modal-telefono").value.trim() || null;
    const password = document.getElementById("modal-password").value;
    const rol = document.getElementById("modal-rol").value;
    const multa_pendiente = parseFloat(document.getElementById("modal-multa").value) || 0;

    const datosUsuario = {
        id_usuario: String(idUsuario),
        nombre: String(nombre),
        correo: String(correo),
        telefono: telefono ? String(telefono) : "",
        password: String(password),
        rol: String(rol),
        multa_pendiente: parseFloat(multa_pendiente)
    };

    try {
        if (id) {
            await actualizarUsuario(String(id), datosUsuario);
        } else {
            await crearUsuario(datosUsuario);
        }
        cerrarModal();
        await renderizarTablaUsuarios();
    } catch (error) {
        alert("Error al guardar: " + error.message);
    }
}

async function eliminarUsuarioProceso(id) {
    if (confirm("¿Está seguro de eliminar esta cuenta? El usuario perderá acceso inmediato.")) {
        try {
            await eliminarUsuario(id);
            await renderizarTablaUsuarios();
        } catch (error) {
            alert("Error: " + error.message);
        }
    }
}


// ==========================================================
// VISTA EXCLUSIVA USUARIOS "MI PERFIL"
// ==========================================================

async function cargarMiPerfil() {
    document.getElementById("tituloPagina").textContent = "Mi Perfil Personal";
    const contenedor = document.getElementById("contenido");
    const sesion = obtenerSesion();

    if (!sesion) return;
    const idUsuarioReal = sesion.id_usuario || sesion.id;

    let usuario;
    try {
        const listaUsuarios = await obtenerUsuarios(); 
        usuario = listaUsuarios.find(u => String(u.id_usuario || u.id) === String(idUsuarioReal));
    } catch (e) {
        usuario = sesion;
    }

    contenedor.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; margin-top: 10px;">
            <div class="card">
                <form id="form-mi-perfil" onsubmit="actualizarMisPropiosDatos(event)">
                    <div class="form-group">
                        <label>Mi Nombre Completo</label>
                        <input type="text" id="perfil-nombre" class="form-control" value="${usuario.nombre || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Mi Correo Electrónico</label>
                        <input type="email" id="perfil-correo" class="form-control" value="${usuario.correo || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Mi Teléfono</label>
                        <input type="text" id="perfil-telefono" class="form-control" value="${usuario.telefono || ''}" placeholder="Ej: 88888888">
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <div style="display: flex; gap: 5px;">
                            <input type="text" id="perfil-password" class="form-control" value="${usuario.password || ''}" required>
                            <button type="button" class="btn btn-secondary" onclick="conmutarVisibilidadPassword()" style="padding: 0 12px; height: 48px;">
                                <i id="icono-ojo" class="fa-solid fa-eye-slash"></i>
                            </button>
                        </div>
                    </div>
                    <div id="perfil-multa-card" style="margin-bottom: 18px; padding: 14px; border-radius: 10px; background: #d1fae5; border-left: 5px solid #2e8b57;">
                        <small style="color: #4b5563; display:block; margin-bottom: 4px;">Estado financiero</small>
                        <strong id="perfil-multa-estado" style="color: #2e8b57; font-size: 15px;">Cargando...</strong>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Actualizar mis Datos</button>
                </form>
            </div>
        </div>
    `;

    const multaMonto = parseFloat(usuario.multa_pendiente || usuario.multa || 0);
    const elMulta = document.getElementById("perfil-multa-estado");
    const cardMulta = document.getElementById("perfil-multa-card");

    if (multaMonto > 0) {
        elMulta.textContent = `Tienes una multa pendiente de CRC ${multaMonto.toLocaleString("es-CR")}`;
        elMulta.style.color = "#e03131";

        cardMulta.style.background = "#fee2e2";
        cardMulta.style.borderLeftColor = "#e03131";
    } else {
        elMulta.textContent = "No tienes multas pendientes";
        elMulta.style.color = "#2e8b57";

        cardMulta.style.background = "#d1fae5";
        cardMulta.style.borderLeftColor = "#2e8b57";
    }
}

function conmutarVisibilidadPassword() {
    const inputPass = document.getElementById("perfil-password");
    const iconoOjo = document.getElementById("icono-ojo");
    
    if (inputPass.type === "password") {
        inputPass.type = "text";
        iconoOjo.classList.remove("fa-eye");
        iconoOjo.classList.add("fa-eye-slash");
    } else {
        inputPass.type = "password";
        iconoOjo.classList.remove("fa-eye-slash");
        iconoOjo.classList.add("fa-eye");
    }
}

async function actualizarMisPropiosDatos(e) {
    e.preventDefault();
    const usuarioActual = obtenerSesion();
    if (!usuarioActual) return;
    
    const idUsuarioReal = usuarioActual.id_usuario || usuarioActual.id;

    const nombre = document.getElementById("perfil-nombre").value.trim();
    const correo = document.getElementById("perfil-correo").value.trim();
    const telefono = document.getElementById("perfil-telefono").value.trim() || "";
    const password = document.getElementById("perfil-password").value; 

    const multa_pendiente = parseInt(usuarioActual.multa_pendiente || usuarioActual.multa, 10) || 0;
    const rolActual = usuarioActual.rol || "Usuario"; 

    const datosUsuario = {
        id_usuario: String(idUsuario),
        nombre: String(nombre),
        correo: String(correo),
        telefono: telefono ? String(telefono) : "",
        password: String(password),
        rol: String(rol),
        multa_pendiente: parseFloat(multa_pendiente)
    };

    try {
        await actualizarUsuario(String(idUsuarioReal), nuevosDatos);
        guardarSesion(nuevosDatos);
        
        if (typeof mostrarNombreUsuario === "function") mostrarNombreUsuario();

        alert("¡Tus datos de perfil han sido modificados con éxito!");
        await cargarMiPerfil(); 
    } catch (error) {
        alert("Error al actualizar tus datos personales: " + error.message);
    }
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}