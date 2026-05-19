// pagina.js

let carrito = JSON.parse(localStorage.getItem('carrito_feelbot')) || [];

// Función matemática adaptada para pesos mexicanos ($ MXN)
function calcularPrecio() {
    const selectEntrega = document.getElementById('entrega');
    const selectMovimiento = document.getElementById('movimiento');
    const selectCuerpo = document.getElementById('cuerpo');
    const selectJuguetes = document.getElementById('juguetes');
    
    if (!selectEntrega || !selectMovimiento || !selectCuerpo || !selectJuguetes) return 0;

    // PRECIO BASE MÍNIMO: $1000 MXN
    const precioBase = 1000; 
    
    const precioEntrega = parseInt(selectEntrega.value) || 0;
    const precioMovimiento = parseInt(selectMovimiento.value) || 0;
    const precioCuerpo = parseInt(selectCuerpo.value) || 0;
    const precioJuguetes = parseInt(selectJuguetes.value) || 0;
    
    // Suma total incluyendo el nuevo mínimo de $1000
    const total = precioBase + precioEntrega + precioMovimiento + precioCuerpo + precioJuguetes;
    
    const contenedorPrecio = document.getElementById('precio-total');
    if (contenedorPrecio) {
        contenedorPrecio.textContent = '$' + total + ' MXN';
    }
    return total;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function abrirCarrito() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.add('open');
    }
}

function agregarModeloPredefinido(nombre, precio) {
    const producto = {
        id: Date.now() + Math.random(),
        nombre: nombre,
        detalles: "Configuración estándar de fábrica",
        precio: precio
    };
    carrito.push(producto);
    guardarCarritoEnStorage();
    actualizarInterfazCarrito();
    abrirCarrito();
}

function agregarRobotPersonalizado() {
    const colChasis = document.getElementById('color-chasis').value;
    const colCabeza = document.getElementById('color-cabeza').value;
    const colExtremidades = document.getElementById('color-extremidades').value;

    const selectCuerpo = document.getElementById('cuerpo');
    const cuerpoTexto = selectCuerpo.options[selectCuerpo.selectedIndex].text.split(' (+')[0];

    const selectMov = document.getElementById('movimiento');
    const movimientoTexto = selectMov.options[selectMov.selectedIndex].text.split(' (+')[0];

    const selectJug = document.getElementById('juguetes');
    const juguetesTexto = selectJug.options[selectJug.selectedIndex].text.split(' (+')[0];

    const utilidad = document.getElementById('utilidad').value;
    
    const selectEntrega = document.getElementById('entrega');
    const entregaTexto = selectEntrega.options[selectEntrega.selectedIndex].text.split(' ($')[0];
    
    const precioTotal = calcularPrecio();

    const producto = {
        id: Date.now() + Math.random(),
        nombre: "🤖 FeelBot Personalizado",
        detalles: `Cuerpo: ${cuerpoTexto} [Chasis: ${colChasis}, Cabeza: ${colCabeza}, Extr: ${colExtremidades}]. Movimiento: ${movimientoTexto}. Diversión: ${juguetesTexto}. Herramienta: ${utilidad}. Entrega: ${entregaTexto}.`,
        precio: precioTotal
    };

    carrito.push(producto);
    guardarCarritoEnStorage();
    actualizarInterfazCarrito();
    abrirCarrito();
}

function eliminarItem(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarritoEnStorage();
    actualizarInterfazCarrito();
}

function procesarPago() {
    alert('¡Gracias por tu simulación de compra en FeelBot!');
    carrito = [];
    guardarCarritoEnStorage();
    actualizarInterfazCarrito();
    toggleCart();
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito_feelbot', JSON.stringify(carrito));
}

function actualizarInterfazCarrito() {
    const contenedorItems = document.getElementById('cart-items');
    const contenedorContador = document.getElementById('cart-count');
    const contenedorTotal = document.getElementById('cart-total');
    
    if (!contenedorItems) return;
    
    contenedorItems.innerHTML = '';
    
    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; color:var(--gray); margin-top:2rem;">El carrito está vacío.</p>';
    } else {
        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p>${item.detalles}</p>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="cart-item-price">$${item.precio} MXN</span>
                    <button class="remove-btn" onclick="eliminarItem(${item.id})">🗑️</button>
                </div>
            `;
            contenedorItems.appendChild(itemElement);
        });
    }

    if (contenedorContador) contenedorContador.textContent = carrito.length;
    
    const totalSuma = carrito.reduce((suma, item) => suma + item.precio, 0);
    if (contenedorTotal) contenedorTotal.textContent = `$${totalSuma} MXN`;
}

document.addEventListener("DOMContentLoaded", () => {
    calcularPrecio();
    actualizarInterfazCarrito();
});