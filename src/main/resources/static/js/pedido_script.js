// Variable global para el carrito
let carrito = {};
// Objeto para mantener el registro de los items individuales
let itemsCarrito = {};

// Cargar los pedidos cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarPedidos);

function cargarPedidos() {
    fetch('/json/pedidos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo pedidos.json');
            }
            return response.json();
        })
        .then(pedidos => {
            let tablaHTML = "";
            for (let categoria in pedidos) {
                if (pedidos[categoria].length > 0) {
                    tablaHTML += `<div class="categoria-container">
                                    <h2>${categoria}</h2>
                                    <div class="productos-container" id="${categoria}">
                                        <button class="toggle-button" onclick="toggleCategoria('${categoria}')">+</button>
                                        <div class="productos-lista"></div>
                                        <div class="categoria-info">
                                            <p>Productos: <span class="total-productos">0</span></p>
                                            <p>Total: $<span class="total-precio">0</span></p>
                                        </div>
                                    </div>
                                </div>`;
                }
            }
            document.getElementById("tablaPedidos").innerHTML = tablaHTML;

            // Añadir los productos al desplegable
            for (let categoria in pedidos) {
                let categoriaDiv = document.getElementById(categoria).querySelector('.productos-lista');
                pedidos[categoria].forEach(item => {
                    categoriaDiv.innerHTML += `<div class="producto">
                                                <span>${item.pedido} - $${item.precio}</span>
                                                <button class="agregar-btn" onclick="agregarProducto('${categoria}', '${item.pedido}', ${item.precio})">+</button>
                                                <button class="eliminar-btn" onclick="eliminarProducto('${categoria}', '${item.pedido}', ${item.precio})">-</button>
                                              </div>`;
                });
            }
        })
        .catch(error => console.error('Error cargando los pedidos:', error));
}

function toggleCategoria(categoria) {
    const categoriaDiv = document.getElementById(categoria).querySelector('.productos-lista');
    const button = document.getElementById(categoria).querySelector('.toggle-button');
    if (categoriaDiv.style.display === "none") {
        categoriaDiv.style.display = "block";
        button.textContent = "-";
    } else {
        categoriaDiv.style.display = "none";
        button.textContent = "+";
    }
}

function agregarProducto(categoria, pedido, precio) {
    // Manejo del carrito por categoría para mantener compatibilidad con código existente
    if (!carrito[categoria]) {
        carrito[categoria] = [];
    }
    if (carrito[categoria].length < 15) {
        carrito[categoria].push(precio);
        actualizarTotal();
        actualizarCategoria(categoria);

        // Actualizar el registro de items individuales para el carrito de compras
        const itemKey = `${categoria}:${pedido}`;
        if (!itemsCarrito[itemKey]) {
            itemsCarrito[itemKey] = {
                categoria: categoria,
                nombre: pedido,
                precio: precio,
                cantidad: 0,
                totalItem: 0
            };
        }
        itemsCarrito[itemKey].cantidad++;
        itemsCarrito[itemKey].totalItem = itemsCarrito[itemKey].cantidad * precio;

        actualizarCarritoCompras();
    } else {
        alert('No puedes agregar más de 15 productos en esta categoría.');
    }
}

function eliminarProducto(categoria, pedido, precio) {
    if (!carrito[categoria]) {
        return;
    }

    const index = carrito[categoria].indexOf(precio);
    if (index > -1) {
        carrito[categoria].splice(index, 1);
        actualizarTotal();
        actualizarCategoria(categoria);

        // Actualizar el registro de items individuales para el carrito de compras
        const itemKey = `${categoria}:${pedido}`;
        if (itemsCarrito[itemKey] && itemsCarrito[itemKey].cantidad > 0) {
            itemsCarrito[itemKey].cantidad--;
            itemsCarrito[itemKey].totalItem = itemsCarrito[itemKey].cantidad * precio;

            // Si la cantidad llega a 0, eliminar el item del registro
            if (itemsCarrito[itemKey].cantidad === 0) {
                delete itemsCarrito[itemKey];
            }
        }

        actualizarCarritoCompras();
    }
}

function actualizarTotal() {
    let total = 0;
    for (let categoria in carrito) {
        total += carrito[categoria].reduce((sum, price) => sum + price, 0);
    }
    document.getElementById("totalPrecio").textContent = total;
}

function actualizarCategoria(categoria) {
    let totalProductos = carrito[categoria]?.length || 0;
    let totalCategoria = carrito[categoria]?.reduce((sum, price) => sum + price, 0) || 0;
    document.getElementById(categoria).querySelector('.total-productos').textContent = totalProductos;
    document.getElementById(categoria).querySelector('.total-precio').textContent = totalCategoria;
}

function actualizarCarritoCompras() {
    const carritoItemsDiv = document.getElementById('carritoItems');
    const totalCarritoSpan = document.getElementById('totalCarrito');

    // Si no hay items, mostrar mensaje
    if (Object.keys(itemsCarrito).length === 0) {
        carritoItemsDiv.innerHTML = '<p class="carrito-vacio">No hay productos en el carrito</p>';
        totalCarritoSpan.textContent = '0';
        return;
    }

    // Generar HTML para los items del carrito
    let carritoHTML = '<div class="items-list">';
    let totalCarrito = 0;

    // Agrupar por categoría
    const itemsPorCategoria = {};

    for (const itemKey in itemsCarrito) {
        const item = itemsCarrito[itemKey];

        if (!itemsPorCategoria[item.categoria]) {
            itemsPorCategoria[item.categoria] = [];
        }

        itemsPorCategoria[item.categoria].push(item);
        totalCarrito += item.totalItem;
    }

    // Generar HTML por categoría
    for (const categoria in itemsPorCategoria) {
        carritoHTML += `<div class="categoria-carrito">
                          <h3>${categoria}</h3>
                          <ul>`;

        let totalCategoria = 0;

        itemsPorCategoria[categoria].forEach(item => {
            carritoHTML += `<li>
                              <span class="item-nombre">${item.nombre}</span>
                              <span class="item-cantidad">x${item.cantidad}</span>
                              <span class="item-precio">$${item.totalItem}</span>
                           </li>`;
            totalCategoria += item.totalItem;
        });

        carritoHTML += `</ul>
                        <p class="total-categoria">Total ${categoria}: $${totalCategoria}</p>
                       </div>`;
    }

    carritoHTML += '</div>';

    // Actualizar el DOM
    carritoItemsDiv.innerHTML = carritoHTML;
    totalCarritoSpan.textContent = totalCarrito;
}
// Añadir el Event Listener para el botón "Realizar Pedido" dentro de DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos(); // Asegúrate de que cargarPedidos() se llama aquí
    const realizarPedidoBtn = document.getElementById('realizarPedidoBtn');
    realizarPedidoBtn.addEventListener('click', enviarPedidoWhatsApp);
});

function enviarPedidoWhatsApp() {
    const telefono = "573234106061";
    let mensaje = "";

    // Capturar información del usuario
    const nombre = document.getElementById('nombreUsuario').value;
    const direccion = document.getElementById('direccionUsuario').value;
    const billete = document.getElementById('billeteUsuario').value;
    const solicitud = document.getElementById('solicitudUsuario').value;

    if (!nombre || !direccion) {
        alert('Por favor, ingresa tu nombre y dirección.');
        return;
    }

    if (Object.keys(itemsCarrito).length === 0) {
        alert('El carrito está vacío. Agrega productos antes de realizar el pedido.');
        return;
    }

    // Construir el mensaje
    mensaje = `A nombre de ${nombre}, realizo este pedido:\n\n`;

    // Agrupar items por categoría
    const itemsPorCategoria = {};
    for (const itemKey in itemsCarrito) {
        const item = itemsCarrito[itemKey];
        if (!itemsPorCategoria[item.categoria]) {
            itemsPorCategoria[item.categoria] = [];
        }
        itemsPorCategoria[item.categoria].push(item);
    }

    // Generar mensaje por categoría
    for (const categoria in itemsPorCategoria) {
        mensaje += `*${categoria}*\n`;
        itemsPorCategoria[categoria].forEach(item => {
            mensaje += `- ${item.nombre} x${item.cantidad}\n`;
        });
        mensaje += '\n';
    }

    mensaje += `Por favor, tener en cuenta: ${solicitud}.\n`;
    mensaje += `Mi dirección es : ${direccion}.\n`;

    if (billete) {
        mensaje += `Voy a pagar con un billete de valor:  ${billete}.`;
    }

    // Reemplazar espacios por %20 y otros caracteres especiales
    var SendMensage = mensaje.replace(/ /g, '%20')
                             .replace(/\n/g, '%0A')
                             .replace(/\*/g, '%2A')
                             .replace(/-/g, '%2D')
                             .replace(/#/g, '%23');

    const whatsappLink = `https://api.whatsapp.com/send/?phone=${telefono}&text=${SendMensage}&type=phone_number&app_absent=0`;

    // Abrir el enlace de WhatsApp
    window.open(whatsappLink, '_blank');
}
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos(); // Asegúrate de que cargarPedidos() se llama aquí
    const realizarPedidoBtn = document.getElementById('realizarPedidoBtn');
    realizarPedidoBtn.addEventListener('click', enviarPedidoWhatsApp);

    const descargarQRBtn = document.getElementById('descargarQRBtn');
    descargarQRBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = '/images/Pagos/QR_Trevia.jpg';
        link.download = 'QR_Trevia.jpg';
        link.click();
    });
});