// c:/Users/Silvia Mereles/Desktop/Mi Tienda/productos.js

/**
 * @param {number | string} numero El número a formatear.
 * @returns {string} El número formateado como cadena.
 */
function formatearNumero(numero) {
    const partes = parseFloat(numero).toFixed(2).split('.');
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const parteDecimal = partes[1];
    return `${parteEntera},${parteDecimal}`;
}

/**
 * @param {number} precioBase El precio del producto sin IVA.
 * @param {number} [porcentajeIVA=21] El porcentaje de IVA a aplicar (opcional, por defecto 21%).
 * @returns {object | null}  null si hay error.
 */
function calcularYMostrarPrecios(cardElement, precioBase, porcentajeIVA = 21) {
    if (typeof precioBase !== 'number' || precioBase < 0) {
        console.error("El precio base debe ser un número positivo.", cardElement);
        return null;
    }
    if (typeof porcentajeIVA !== 'number' || porcentajeIVA < 0) {
        console.warn("El porcentaje de IVA no es válido, se usará el 21% por defecto para el producto:", cardElement);
        porcentajeIVA = 21;
    }

    const ivaDecimal = porcentajeIVA / 100;
    const montoIVA = precioBase * ivaDecimal;
    const precioTotal = precioBase + montoIVA;
    cardElement.dataset.precioFinalNumerico = precioTotal.toFixed(2); // Guardamos el precio final para el carrito

    const preciosCalculados = {
        precioSinIVA: formatearNumero(precioBase),
        montoIVA: formatearNumero(montoIVA), // Formateamos también el monto de IVA 
        precioConIVA: formatearNumero(precioTotal),
        porcentajeIVAUtilizado: porcentajeIVA
    };

       let elementoPrecioExistente = cardElement.querySelector('.precio'); // Para .producto-card
    if (!elementoPrecioExistente && cardElement.classList.contains('promo-card')) {
        elementoPrecioExistente = cardElement.querySelector('.precio-oferta'); // Para .promo-card
    }

    const contenedorParaPrecios = document.createElement('div');
    contenedorParaPrecios.classList.add('detalle-precios-producto');


    contenedorParaPrecios.innerHTML = `
        <p class="precio-final-item">
            <span class="precio-final-etiqueta">Precio Final:</span>
            <span class="precio-final-valor">$${preciosCalculados.precioConIVA}</span>
        </p>
        <p class="precio-base-item">
            <span class="precio-base-valor">$${preciosCalculados.precioSinIVA}</span>
            <span class="precio-base-leyenda">Precio Sin Impuestos</span>
        </p>
    `;

    if (elementoPrecioExistente) {
        elementoPrecioExistente.style.display = 'none'; 
        elementoPrecioExistente.parentNode.insertBefore(contenedorParaPrecios, elementoPrecioExistente.nextSibling);
    } else {
          const tituloProducto = cardElement.querySelector('h3');
        if (tituloProducto) {
            tituloProducto.parentNode.insertBefore(contenedorParaPrecios, tituloProducto.nextSibling);
        } else {
            cardElement.appendChild(contenedorParaPrecios);
        }
    }
    return preciosCalculados;
}

document.addEventListener('DOMContentLoaded', function() {
    let carritoItems = JSON.parse(localStorage.getItem('miTiendaCarrito')) || [];

    function guardarCarrito() {
        localStorage.setItem('miTiendaCarrito', JSON.stringify(carritoItems));
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Actualizar el contador
    }
    function agregarAlCarrito(producto) {
        const itemExistente = carritoItems.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carritoItems.push({ ...producto, cantidad: 1 });
        }
        guardarCarrito();
        const totalUnidades = carritoItems.reduce((sum, item) => sum + item.cantidad, 0);
        alert(`"${producto.nombre}" agregado/actualizado. Total de unidades en carrito: ${totalUnidades}`);
    }

    // Función para procesar tarjetas estáticas (ej. en Promociones.html)
    function procesarTarjetasEstaticas() {
        // Seleccionar todas las tarjetas de producto y promoción que tengan un botón de comprar
        const tarjetasEstaticas = document.querySelectorAll('.producto-card, .promo-card');

        tarjetasEstaticas.forEach(card => {
            const precioBaseTexto = card.dataset.precioBase;
            if (precioBaseTexto) {
                const precioBase = parseFloat(precioBaseTexto);
                calcularYMostrarPrecios(card, precioBase, card.dataset.iva ? parseFloat(card.dataset.iva) : 21);
            }

            const botonComprar = card.querySelector('.btn-agregar-carrito');
            if (botonComprar && !botonComprar.dataset.listenerAttached) {
                botonComprar.dataset.listenerAttached = "true";
                botonComprar.addEventListener('click', function() {
                    const precioFinalNumerico = parseFloat(card.dataset.precioFinalNumerico);
                    const nombreProducto = card.querySelector('h3')?.textContent || 'Producto Estático';
                    const imagenProducto = card.querySelector('img')?.src || 'imagenes/placeholder.jpg';
                    // Crear un ID único para productos estáticos
                    const idProducto = 'static-' + nombreProducto.replace(/\s+/g, '-').toLowerCase() + '-' + (card.dataset.precioBase || '0');

                    const productoParaCarrito = {
                        id: idProducto,
                        nombre: nombreProducto,
                        precio: precioFinalNumerico,
                        imagen: imagenProducto
                    };
                    agregarAlCarrito(productoParaCarrito);
                });
            }
        });
    }

    // Procesar tarjetas estáticas en cualquier página 
    procesarTarjetasEstaticas();
});
