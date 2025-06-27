// c:/Users/Silvia Mereles/Desktop/Mi Tienda/carrito.js

document.addEventListener('DOMContentLoaded', function () {
    const itemsContainer = document.getElementById('items-carrito-container');
    const totalPrecioElement = document.getElementById('total-precio');
    const mensajeCarritoVacio = document.querySelector('.carrito-vacio-mensaje');
    const totalCarritoContainer = document.getElementById('total-carrito-container');
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');

    function formatearPrecioParaVista(numero) {
        if (typeof numero !== 'number') {
            numero = parseFloat(numero) || 0;
        }
        const partes = numero.toFixed(2).split('.');
        const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const parteDecimal = partes[1];
        return `${parteEntera},${parteDecimal}`;
    }

    function renderizarCarrito() {
        const carritoJSON = localStorage.getItem('miTiendaCarrito');
        const carrito = carritoJSON ? JSON.parse(carritoJSON) : [];

        itemsContainer.innerHTML = ''; // Limpio items anteriores

        if (carrito.length === 0) {
            mensajeCarritoVacio.style.display = 'block';
            totalCarritoContainer.style.display = 'none';
            if (itemsContainer.firstChild && itemsContainer.firstChild.nodeType === Node.TEXT_NODE) {
                 // Evitar duplicar 
            } else {
                 itemsContainer.appendChild(mensajeCarritoVacio);
            }
            return;
        }

        mensajeCarritoVacio.style.display = 'none';
        totalCarritoContainer.style.display = 'block';
        let totalGeneral = 0;

        carrito.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');

            const subtotalItem = item.precio * item.cantidad;
            totalGeneral += subtotalItem;

            itemDiv.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h3>${item.nombre}</h3>
                    <p class="precio-item">Precio: $${formatearPrecioParaVista(item.precio)}</p>
                    <div class="cantidad-control">
                        <button class="btn-cantidad menos" data-index="${index}" aria-label="Disminuir cantidad">-</button>
                        <span class="cantidad-valor">${item.cantidad}</span>
                        <button class="btn-cantidad mas" data-index="${index}" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <p>Subtotal: $${formatearPrecioParaVista(subtotalItem)}</p>
                </div>
                <div class="carrito-item-acciones">
                    <button class="btn-eliminar-item" data-index="${index}">Eliminar</button>
                </div>
            `;
            itemsContainer.appendChild(itemDiv);
        });

        totalPrecioElement.textContent = `Total: $${formatearPrecioParaVista(totalGeneral)}`;

           document.querySelectorAll('.btn-eliminar-item').forEach(boton => {
            boton.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                eliminarItemDelCarrito(itemIndex);
            });
        });
        document.querySelectorAll('.btn-cantidad.menos').forEach(boton => {
            boton.addEventListener('click', function() {
                disminuirCantidad(parseInt(this.dataset.index));
            });
        });
        document.querySelectorAll('.btn-cantidad.mas').forEach(boton => {
            boton.addEventListener('click', function() {
                aumentarCantidad(parseInt(this.dataset.index));
            });
        });
    }

    function eliminarItemDelCarrito(index) {
        const carritoJSON = localStorage.getItem('miTiendaCarrito');
        let carrito = carritoJSON ? JSON.parse(carritoJSON) : [];
        carrito.splice(index, 1); 
        localStorage.setItem('miTiendaCarrito', JSON.stringify(carrito));
        window.dispatchEvent(new CustomEvent('cartUpdated')); 
        renderizarCarrito(); 
    }

    function aumentarCantidad(index) {
        const carritoJSON = localStorage.getItem('miTiendaCarrito');
        let carrito = carritoJSON ? JSON.parse(carritoJSON) : [];
        if (carrito[index]) {
            carrito[index].cantidad++;
            localStorage.setItem('miTiendaCarrito', JSON.stringify(carrito));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            renderizarCarrito();
        }
    }

    function disminuirCantidad(index) {
        const carritoJSON = localStorage.getItem('miTiendaCarrito');
        let carrito = carritoJSON ? JSON.parse(carritoJSON) : [];
        if (carrito[index] && carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
            localStorage.setItem('miTiendaCarrito', JSON.stringify(carrito));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            renderizarCarrito();
        } else if (carrito[index] && carrito[index].cantidad === 1) {
            // Si la cantidad es 1 y se disminuye, eliminar el producto
            eliminarItemDelCarrito(index);
        }
    }

    btnVaciarCarrito.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            localStorage.removeItem('miTiendaCarrito');
            window.dispatchEvent(new CustomEvent('cartUpdated')); 
            renderizarCarrito();
        }
    });

    // Renderizar el carrito al cargar la página
    renderizarCarrito();

    window.addEventListener('cartUpdated', function() {
    });
});