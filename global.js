// c:/Users/Silvia Mereles/Desktop/Mi Tienda/global.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('global.js: DOMContentLoaded disparado.');
    const cartCountBadge = document.getElementById('cart-count');

    function updateCartBadge() {
        console.log('global.js: Llamada a updateCartBadge().');
        if (cartCountBadge) {
            console.log('global.js: Elemento #cart-count encontrado.');
            const carritoJSON = localStorage.getItem('miTiendaCarrito');
            const carrito = carritoJSON ? JSON.parse(carritoJSON) : [];
            const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            console.log('global.js: Carrito leído de localStorage:', carrito, "Total cantidad:", totalCantidad);
            cartCountBadge.textContent = totalCantidad.toString();
            console.log('global.js: Texto del contador actualizado a:', totalCantidad.toString());
        } else {
            // mensaje en la consola,significa que no se encontró en la página actual.
            console.warn('global.js: Elemento del contador del carrito (cart-count) NO encontrado en esta página.');
        }
    }

    // Actualizo el contador cuando la página carga inicialmente
    updateCartBadge();
    console.log('global.js: updateCartBadge() llamado al inicio.');

    // Importante Escucho cambios en localStorage que ocurran en otras pestañas/ventanas
    window.addEventListener('storage', function(event) {
        console.log('global.js: Evento "storage" disparado.', event);
        if (event.key === 'miTiendaCarrito') { // Escucho cambios en el array del carrito
            console.log('global.js: Evento "storage" detectó cambio en "miTiendaCarrito".');
            updateCartBadge();
        }
    });

    // Escucho el evento cuando se agrega un ítem en la misma página.
    window.addEventListener('cartUpdated', function() {
        console.log('global.js: Evento personalizado "cartUpdated" recibido.');
        updateCartBadge();
    });
});