document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    form.addEventListener('submit', function(event) {
        // Prevenir el envío del formulario para realizar la validación primero
        event.preventDefault();
        
        let esValido = validarFormulario();

        if (esValido) {
            // Si todo es válido, se envía el formulario
            console.log('Formulario válido. Enviando...');
            form.submit();
        } else {
            console.log('Formulario inválido. Por favor, corrija los errores.');
        }
    });

    function validarFormulario() {
        let esValido = true;
        // Resetear errores previos
        resetearErrores();

        // Validar Nombre
        if (nombre.value.trim() === '') {
            mostrarError(nombre, 'El nombre es obligatorio.');
            esValido = false;
        }

        // Validar Apellido
        if (apellido.value.trim() === '') {
            mostrarError(apellido, 'El apellido es obligatorio.');
            esValido = false;
        }

        // Validar Email
        if (email.value.trim() === '') {
            mostrarError(email, 'El correo electrónico es obligatorio.');
            esValido = false;
        } else if (!esEmailValido(email.value)) {
            mostrarError(email, 'Por favor, introduce un correo electrónico válido.');
            esValido = false;
        }

        // Validar Mensaje
        if (mensaje.value.trim() === '') {
            mostrarError(mensaje, 'El mensaje no puede estar vacío.');
            esValido = false;
        }

        return esValido;
    }

    function mostrarError(input, mensaje) {
        const formGroup = input.parentElement;
        const errorSpan = formGroup.querySelector('.error-text');
        errorSpan.textContent = mensaje;
    }

    function resetearErrores() {
        const errores = document.querySelectorAll('.error-text');
        errores.forEach(error => {
            error.textContent = '';
        });
    }

    function esEmailValido(email) {
        // Expresión regular para validar email
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});