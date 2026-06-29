// @Authores: Carlos Ovares, Brandon Sanchez


// ===========================================
// TIPO DE SESIÓN
// ===========================================

const STORAGE_KEY = "powerbank_user";

function guardarSesion(usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

function obtenerSesion() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

function eliminarSesion() {
    localStorage.removeItem(STORAGE_KEY);
}

function estaLogueado() {
    return obtenerSesion() !== null;
}

function esAdministrador() {
    const usuario = obtenerSesion();
    return usuario && usuario.rol === "Admin";
}

// ===========================================
// REDIRECCIONES
// ===========================================

function verificarSesion() {

    if (!estaLogueado()) {
        window.location.href = "login.html";
    }

}

function cerrarSesion() {

    eliminarSesion();

    window.location.href = "login.html";

}

// ===========================================
// MENSAJES
// ===========================================

function mostrarMensaje(texto, tipo = "success") {

    const contenedor = document.getElementById("mensaje");

    if (!contenedor) {

        alert(texto);
        return;

    }

    contenedor.innerHTML = `
        <div class="alert ${tipo}">
            ${texto}
        </div>
    `;

    setTimeout(() => {

        contenedor.innerHTML = "";

    }, 3000);

}

function mostrarError(texto) {

    mostrarMensaje(texto, "error");

}

function mostrarExito(texto) {

    mostrarMensaje(texto, "success");

}

// ===========================================
// CONFIRMAR
// ===========================================

function confirmar(mensaje) {

    return window.confirm(mensaje);

}

// ===========================================
// FORMATO DE FECHA
// ===========================================

function formatearFecha(fecha) {

    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-CR");

}

// ===========================================
// FORMATO DE NÚMEROS
// ===========================================

function formatearNumero(numero) {

    return new Intl.NumberFormat("es-CR").format(numero);

}

// ===========================================
// GENERAR ID
// ===========================================

function generarId(prefijo = "") {

    return prefijo + Date.now();

}