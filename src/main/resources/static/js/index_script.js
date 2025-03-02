document.addEventListener('DOMContentLoaded', () => {
    fetch('/json/principal.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            cargarProductos(data.productos_vendidos, 'productos-vendidos');
            cargarProductos(data.productos_recomendados, 'productos-recomendados');
        })
        .catch(error => console.error('Error cargando los productos:', error));
});

function cargarProductos(productos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        productoDiv.innerHTML = `<h3>${producto.nombre}</h3><p>${producto.precio}</p>`;
        contenedor.appendChild(productoDiv);
    });
}