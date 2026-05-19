document.addEventListener("DOMContentLoaded", async function () {
  const selectCategoria = document.getElementById("selectCategoria");
  const selectProducto = document.getElementById("selectProducto");
  const contenedorProducto = document.getElementById("contenedorProducto");
  const detalleProducto = document.getElementById("detalleProducto");
  const listaCarrito = document.getElementById("listaCarrito");
  const totalVenta = document.getElementById("totalVenta");
  const btnAgregar = document.getElementById("btnAgregar");

  let carrito = []; // Aquí guardaremos los productos
  let productoActual = null; // Para saber cuál está viendo el usuario

  // 1. Cargar categorías
  async function cargarCategorias() {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      const categorias = await response.json();
      selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';
      categorias.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat.slug || cat;
        option.textContent = cat.name || cat;
        selectCategoria.appendChild(option);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 2. Cargar productos
  selectCategoria.addEventListener("change", async function () {
    if (!this.value) {
      contenedorProducto.classList.add("d-none");
      return;
    }
    const response = await fetch(`https://dummyjson.com/products/category/${this.value}`);
    const data = await response.json();
    
    selectProducto.innerHTML = '<option value="">Selecciona un producto</option>';
    data.products.forEach(p => {
      let option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.title;
      selectProducto.appendChild(option);
    });
    contenedorProducto.classList.remove("d-none");
    detalleProducto.classList.add("d-none");
  });

  // 3. Ver detalle del producto y guardarlo temporalmente
  selectProducto.addEventListener("change", async function () {
    if (!this.value) return;
    const response = await fetch(`https://dummyjson.com/products/${this.value}`);
    productoActual = await response.json(); // Guardamos el objeto completo

    document.getElementById("productoNombre").textContent = productoActual.title;
    document.getElementById("productoDescripcion").textContent = productoActual.description;
    
    // Cálculo de precio con descuento
    const pFinal = productoActual.price - (productoActual.price * productoActual.discountPercentage / 100);
    productoActual.precioFinalCalculado = pFinal; // Lo guardamos para el carrito
    
    document.getElementById("productoPrecioFinal").textContent = pFinal.toFixed(2);
    document.getElementById("productoImagen").src = productoActual.thumbnail;
    
    detalleProducto.classList.remove("d-none");
  });

  // 4. Lógica del Carrito (Agregar)
  btnAgregar.onclick = function () {
    if (productoActual) {
      carrito.push({
        nombre: productoActual.title,
        precio: productoActual.precioFinalCalculado
      });
      actualizarCarrito();
    }
  };

  // 5. Función para refrescar la tabla y el total
  function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let sumaTotal = 0;

    carrito.forEach((prod, index) => {
      sumaTotal += prod.precio;
      
      const fila = `
        <tr>
          <td>${prod.nombre}</td>
          <td>$${prod.precio.toFixed(2)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
        </tr>
      `;
      listaCarrito.innerHTML += fila;
    });

    totalVenta.textContent = sumaTotal.toFixed(2);
  }

  // 6. Eliminar producto
  window.eliminarDelCarrito = function (index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  };

  cargarCategorias();
});