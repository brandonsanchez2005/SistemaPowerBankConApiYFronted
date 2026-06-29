// @Authores: Carlos Ovares, Brandon Sanchez

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("loginForm");
    if (formulario) {
        formulario.addEventListener("submit", iniciarSesion);
    }

    const btnPassword = document.getElementById("btnPassword");
    if (btnPassword) {
        btnPassword.addEventListener("click", mostrarPassword);
    }
});

async function iniciarSesion(e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (!correo || !password) {
        if (typeof mostrarError === "function") {
            mostrarError("Debe completar todos los campos.");
        } else {
            alert("Debe completar todos los campos.");
        }
        return;
    }

    try {
        const usuario = await login(correo, password);
        guardarSesion(usuario);
        window.location.href = "index.html";
    } catch (error) {
        if (typeof mostrarError === "function") {
            mostrarError(error.message || "Error al conectar con el servidor.");
        } else {
            alert(error.message);
        }
    }
}

function mostrarPassword() {
    const input = document.getElementById("password");
    const icono = document.querySelector("#btnPassword i");

    if (!input || !icono) return;

    if (input.type === "password") {
        input.type = "text";
        icono.classList.remove("fa-eye");
        icono.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icono.classList.remove("fa-eye-slash");
        icono.classList.add("fa-eye");
    }
}