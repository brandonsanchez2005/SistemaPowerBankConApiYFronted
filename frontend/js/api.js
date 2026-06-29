// @Authores: Carlos Ovares, Brandon Sanchez

const API_URL = "http://localhost:8000";

async function request(url, method = 'GET', body = null) {
    const config = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_URL}${url}`, config);
    
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error("Error en el servidor");
        }

        throw new Error(errorData.detail || errorData.message || "Error al procesar la solicitud");
    }

    return await response.json();
}

// ==========================================
// LOGIN
// ==========================================

async function login(correo, password) {

    return await request("/auth/login", "POST", {
        correo,
        password
    });

}

// ==========================================
// USUARIOS
// ==========================================

async function obtenerUsuarios() {
    return await request("/users");
}

async function obtenerUsuario(id) {
    return await request(`/users/by-id/${id}`);
}

async function crearUsuario(usuario) {
    return await request("/users", "POST", usuario);
}

async function actualizarUsuario(id, usuario) {
    return await request(`/users/${id}`, "PUT", usuario);
}

async function eliminarUsuario(id) {
    return await request(`/users/${id}`, "DELETE");
}

// ==========================================
// POWER BANKS
// ==========================================

async function obtenerPowerBanks() {
    return await request("/powerbanks");
}

async function obtenerDisponibles() {
    return await request("/powerbanks/available");
}

async function obtenerPowerBank(id) {
    return await request(`/powerbanks/by-id/${id}`);
}

async function crearPowerBank(powerbank) {
    return await request("/powerbanks", "POST", powerbank);
}

async function actualizarPowerBank(id, powerbank) {
    return await request(`/powerbanks/${id}`, "PUT", powerbank);
}

async function eliminarPowerBank(id) {
    return await request(`/powerbanks/${id}`, "DELETE");
}

// ==========================================
// PRÉSTAMOS
// ==========================================

async function obtenerPrestamos() {
    return await request("/loans");
}

async function obtenerPrestamosUsuario(idUsuario) {
    return await request(`/loans/by-user/${idUsuario}`);
}

async function obtenerPrestamosActivos() {
    return await request("/loans/active");
}

async function crearPrestamo(prestamo) {
    return await request("/loans", "POST", prestamo);
}

async function devolverPrestamo(idPrestamo) {
    return await request(`/loans/return/${idPrestamo}`, "PUT");
}

async function aceptarPrestamoApi(idPrestamo) {
    return await request(`/loans/accept/${idPrestamo}`, "PUT");
}

async function rechazarPrestamoApi(idPrestamo) {
    return await request(`/loans/reject/${idPrestamo}`, "PUT");
}
// ==========================================
// REPORTES
// ==========================================

async function reportePowerBanksEstado() {
    return await request("/reports/powerbanks-by-status");
}

async function reportePrestamosUsuario() {
    return await request("/reports/loans-by-user");
}

async function reportePrestamosActivos() {
    return await request("/reports/active-loans");
}