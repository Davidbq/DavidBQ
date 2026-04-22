document.addEventListener("DOMContentLoaded", async function () {

  const selectCategoria = document.getElementById("selectCategoria");

  const selectProducto = document.getElementById("selectProducto");

  const contenedorProducto = document.getElementById("contenedorProducto");

  const detalleProducto = document.getElementById("detalleProducto");

 

  // ─── 1. Cargar categorías al iniciar la página ───────────────────────────────

  async function cargarCategorias() {

    try {

      const response = await fetch("https://dummyjson.com/products/categories");

      const categorias = await response.json();

 

      // Limpiar el select y agregar opciones (igual que con las razas)

      selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';

      categorias.forEach((cat) => {

        let option = document.createElement("option");

        option.value = cat.slug;          // slug: "smartphones", "laptops", etc.

        option.textContent = cat.name;    // name: "Smartphones", "Laptops", etc.

        selectCategoria.appendChild(option);

      });

 

      // Evento cuando el usuario elige una categoría

      selectCategoria.addEventListener("change", function () {

        if (selectCategoria.value) {

          cargarProductosPorCategoria(selectCategoria.value);

        } else {

          contenedorProducto.classList.add("d-none");

          detalleProducto.classList.add("d-none");

        }

      });

 

    } catch (error) {

      console.error("Error cargando categorías:", error);

      selectCategoria.innerHTML = '<option value="">Error cargando categorías</option>';

    }

  }

 

  // ─── 2. Cargar productos de la categoría elegida ─────────────────────────────

  async function cargarProductosPorCategoria(categoria) {

    try {

      const response = await fetch(`https://dummyjson.com/products/category/${categoria}`);

      const data = await response.json();

      const productos = data.products;

 

      // Llenar el segundo select con los productos de esa categoría

      selectProducto.innerHTML = '<option value="">Selecciona un producto</option>';

      productos.forEach((producto) => {

        let option = document.createElement("option");

        option.value = producto.id;

        option.textContent = producto.title;

        selectProducto.appendChild(option);

      });

 

      // Mostrar el select de productos

      contenedorProducto.classList.remove("d-none");

      detalleProducto.classList.add("d-none");

 

      // Evento cuando el usuario elige un producto

      selectProducto.onchange = function () {

        let productoSeleccionado = productos.find(

          (p) => p.id == selectProducto.value

        );

        if (productoSeleccionado) {

          mostrarDetalles(productoSeleccionado);

        } else {

          detalleProducto.classList.add("d-none");

        }

      };

 

    } catch (error) {

      console.error("Error cargando productos:", error);

    }

  }

 

  // ─── 3. Mostrar detalles del producto seleccionado ───────────────────────────

  function mostrarDetalles(producto) {

    document.getElementById("productoNombre").textContent = producto.title;

    document.getElementById("productoDescripcion").textContent = producto.description || "No disponible";

    document.getElementById("productomarca").textContent = producto.brand || "No disponible";

    document.getElementById("productoCategoria").textContent = producto.category || "No disponible";

    document.getElementById("productoRating").textContent = producto.rating?.toFixed(1) || "No disponible";

    document.getElementById("productoStock").textContent = producto.stock ?? "No disponible";

 

    // Precio original

    const precio = producto.price || 0;

    document.getElementById("productoPrecio").textContent = precio.toFixed(2);

 

    // Descuento y precio final

    const descuento = producto.discountPercentage || 0;

    const precioFinal = precio - (precio * descuento / 100);

    document.getElementById("productoDescuento").textContent = descuento.toFixed(1);

    document.getElementById("productoPrecioFinal").textContent = precioFinal.toFixed(2);

 

    // Clasificación de precio (equivalente a la clasificación de peso en perros)

    let clasificacion = "No disponible";

    if (precio > 0) {

      if (precio < 20)        clasificacion = "💚 Económico";

      else if (precio < 100)  clasificacion = "🔵 Accesible";

      else if (precio < 500)  clasificacion = "🟡 Premium";

      else                    clasificacion = "🔴 Lujo";

    }

    document.getElementById("precioClasificacion").textContent = clasificacion;

 

    // Barra de rating (de 0 a 5 → convertimos a porcentaje sobre 100)

    const rating = producto.rating || 0;

    const porcentajeRating = (rating / 5) * 100;

    document.getElementById("barraRating").style.width = porcentajeRating + "%";

    document.getElementById("porcentajeRating").textContent = rating.toFixed(1) + " / 5";

 

    // Color de la barra según el rating

    document.getElementById("barraRating").className =

      `progress-bar bg-${

        rating >= 4.5 ? "success" :

        rating >= 3.5 ? "primary" :

        rating >= 2.5 ? "warning"  :

        "danger"

      }`;

 

    // Imagen del producto

    document.getElementById("productoImagen").src =

      producto.thumbnail || "https://via.placeholder.com/300x200?text=Sin+imagen";

 

    detalleProducto.classList.remove("d-none");

  }

 

  // ─── Arrancar ────────────────────────────────────────────────────────────────

  cargarCategorias();

});
