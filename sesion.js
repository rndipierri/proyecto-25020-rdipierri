// c:/Users/Silvia Mereles/Desktop/Mi Tienda/sesion.js

// todo se ejecuta cuando el DOM se carga completamente
document.addEventListener('DOMContentLoaded', () => {
    // selecciono el formulario del dom
    const formulario = document.querySelector('form');

    // recibe un elemento e introduce el mensaje de error
    const mostrarError = (input, mensaje) => {
        const divPadre = input.parentNode;
        // encuentra el elemento error-text
        const errorText = divPadre.querySelector('.error-text');
        divPadre.classList.add('error');
        // agrega mensaje de error
        errorText.innerText = mensaje;
    };

      // funcion eliminar mensaje de error
    const eliminarError = input => {
        // encontrar el elemento padre del campo
        const divPadre = input.parentNode;
        //eliminar la clase de error del elemento padre
        divPadre.classList.remove('error');
        // encuentra el elemento error-text
        const errorText = divPadre.querySelector('.error-text');
        //establecemos el texto como vacio
        errorText.innerText = '';
    };

     // funcion para corroborar si los campos estan completos para quitar error
    formulario.querySelectorAll('input').forEach(input => {
        // se activa cuando el valor de un elemento del formulario cambia y se sale del elemento 
        input.addEventListener('change', () => {
            // obtenemos el valor del campo seleccionado
            const valor = input.value.trim();//elimina cualquier espacio en blanco al principio y al final del valor.
            // condicion para evaluar
            if (valor !== '') {
                eliminarError(input);
            }
        });
    });

    // funcion validar campo
    function validarCampo(campoId, mensaje) {
        const campo = document.getElementById(campoId);
        const value = campo.value.trim();

        if (value === '') { // Usar === para comparación estricta
            mostrarError(campo, mensaje);
            return false; // indicamos que la validacion fallo
        } else {
            eliminarError(campo);
            return true; // indicamos que la validacion ha sido exitosa
        }
    }

    // Función para validar un correo electrónico 
    function isEmail(email) {
        const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return expresionRegular.test(email); // devuelve true si la cadena coincide 
    }

    // funcion para validar el campo de email
    function validarEmail(campoId, mensaje) {
        // obtenemos elemento mediante id
        const campo = document.getElementById(campoId);
        const email = campo.value.trim();
        // si el campo esta vacio
        if (email === '') {
            //establecemos mensaje de error
            mostrarError(campo, 'El correo electrónico es obligatorio'); // Mensaje más específico
            // indicamos que la validacion ha fallado
            return false;
        } else if (!isEmail(email)) {
            //establecemos mensaje de error 
            mostrarError(campo, mensaje);
            // indicamos que la validacion ha fallado
            return false;
        } else {
            // si es valido eliminamos cualquier error
            eliminarError(campo);
            // indicamos que la validacion es exitosa
            return true;
        }
    }
    // funcion para validar el formulario
    const validarFormulario = () => {
        let validar = true; // Asumimos que es válido hasta que una validación falle

         // Es importante que la validación del email se ejecute primero 
        // Si validarEmail devuelve false, 'validar' se convierte en false y permanece así.
        validar = validarEmail('email', 'El correo electrónico no es válido') && validar;
        
        // La validación de la contraseña también debe ejecutarse 
        validar = validarCampo('password', 'La contraseña es obligatoria') && validar;

        return validar;
    };
      // agregar un evento de escucha para cuando se envia el formulario
    formulario.addEventListener('submit', event => {
        event.preventDefault(); // Siempre prevenir el envío por defecto para manejar la validación
        if (!validarFormulario()) {
            console.log("El formulario no es válido. Por favor, corrige los errores.");
            } else {
            console.log("El formulario es válido. Enviando...");
            // Lógica para enviar el formulario 
            alert("Formulario válido. ¡Simulando envío!"); // Mensaje de éxito temporal
            // formulario.submit(); // Si quisieras enviarlo realmente después de la validación
        }
    });
});