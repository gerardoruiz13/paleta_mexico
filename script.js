document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const backgroundContainer = document.querySelector('.background-container');
    const paletteContainer = document.querySelector('.palette-container');
    const generateBtn = document.getElementById('generate-btn');
    const paletteNameEl = document.getElementById('palette-name');
    const saveFavoriteBtn = document.getElementById('save-favorite-btn');
    const favoritesContainer = document.getElementById('favorites-container');
    const notificationEl = document.getElementById('notification');
    const themeToggle = document.getElementById('theme-toggle');

    // --- ESTADO DE LA APLICACIÓN ---
    let paletas = [];
    let favoritos = [];
    let paletaActual = {};

    // --- FUNCIONES PRINCIPALES ---

    // Carga las paletas desde el archivo JSON
    async function cargarPaletas() {
        try {
            const response = await fetch('paletas.json');
            paletas = await response.json();
            generarPaleta(); // Genera una paleta inicial al cargar
        } catch (error) {
            console.error('Error al cargar las paletas:', error);
            const defaultPalette = {
                nombre: "Error de Carga",
                colores: ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6"],
                imagenUrl: "https://images.unsplash.com/photo-1518622392434-cd6590518f8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            };
            mostrarPaleta(defaultPalette);
        }
    }
    
    // Carga las paletas favoritas desde localStorage
    function cargarFavoritas() {
        const favsGuardadas = localStorage.getItem('paletasFavoritas');
        if (favsGuardadas) {
            favoritos = JSON.parse(favsGuardadas);
            renderizarFavoritas();
        }
    }

    // Genera y muestra una nueva paleta
    function generarPaleta() {
        if (paletas.length === 0) return;
        const randomIndex = Math.floor(Math.random() * paletas.length);
        paletaActual = paletas[randomIndex];
        mostrarPaleta(paletaActual);
    }

    // Muestra una paleta en la UI principal
    function mostrarPaleta(paleta) {
        paletteContainer.innerHTML = '';
        paletteNameEl.textContent = paleta.nombre;
        backgroundContainer.style.backgroundImage = `url(${paleta.imagenUrl})`;

        paleta.colores.forEach(color => {
            const colorColumn = document.createElement('div');
            colorColumn.classList.add('color-column');
            colorColumn.style.backgroundColor = color;

            const hexCode = document.createElement('span');
            hexCode.classList.add('hex-code');
            hexCode.textContent = color.toUpperCase();
            
            colorColumn.appendChild(hexCode);
            colorColumn.addEventListener('click', () => copiarColor(color));
            paletteContainer.appendChild(colorColumn);
        });
    }

    // Renderiza todas las paletas favoritas en su sección
    function renderizarFavoritas() {
        favoritesContainer.innerHTML = '';
        favoritos.forEach((paleta, index) => {
            const card = document.createElement('div');
            card.classList.add('fav-palette-card');

            let colorSwatchesHTML = '<div class="fav-palette-colors">';
            paleta.colores.forEach(color => {
                colorSwatchesHTML += `<div class="fav-palette-color-swatch" style="background-color: ${color}"></div>`;
            });
            colorSwatchesHTML += '</div>';

            card.innerHTML = `
                ${colorSwatchesHTML}
                <div class="fav-palette-info">
                    <h4>${paleta.nombre}</h4>
                    <button class="delete-fav-btn" data-index="${index}" title="Eliminar Favorita"><i class="fas fa-trash"></i></button>
                </div>
            `;
            favoritesContainer.appendChild(card);
        });
    }

    // --- FUNCIONES DE UTILIDAD ---

    // Copia el código de color al portapapeles
    function copiarColor(color) {
        navigator.clipboard.writeText(color).then(() => {
            mostrarNotificacion(`¡Color ${color.toUpperCase()} copiado!`);
        }).catch(err => {
            console.error('Error al copiar el color:', err);
        });
    }

    // Muestra una notificación temporal
    function mostrarNotificacion(mensaje) {
        notificationEl.textContent = mensaje;
        notificationEl.classList.add('show');
        setTimeout(() => {
            notificationEl.classList.remove('show');
        }, 2000);
    }

    // Guarda la paleta actual en favoritos
    function guardarFavorita() {
        // Evita duplicados
        if (!favoritos.some(p => p.nombre === paletaActual.nombre)) {
            favoritos.push(paletaActual);
            localStorage.setItem('paletasFavoritas', JSON.stringify(favoritos));
            renderizarFavoritas();
            mostrarNotificacion('¡Paleta guardada en favoritos!');
        } else {
            mostrarNotificacion('Esta paleta ya está en tus favoritos.');
        }
    }

    // Elimina una paleta de favoritos
    function eliminarFavorita(index) {
        favoritos.splice(index, 1);
        localStorage.setItem('paletasFavoritas', JSON.stringify(favoritos));
        renderizarFavoritas();
        mostrarNotificacion('Paleta eliminada.');
    }

    // Cambia entre modo claro y oscuro
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    }

    // Carga la preferencia de tema del usuario
    function cargarTema() {
        const darkModeActivado = localStorage.getItem('darkMode') === 'true';
        themeToggle.checked = darkModeActivado;
        if (darkModeActivado) {
            document.body.classList.add('dark-mode');
        }
    }

    // --- EVENT LISTENERS ---

    generateBtn.addEventListener('click', generarPaleta);
    saveFavoriteBtn.addEventListener('click', guardarFavorita);
    themeToggle.addEventListener('change', toggleDarkMode);

    favoritesContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete-fav-btn')) {
            const index = e.target.closest('.delete-fav-btn').dataset.index;
            eliminarFavorita(index);
        }
    });


    // --- INICIALIZACIÓN ---
    cargarTema();
    cargarPaletas();
    cargarFavoritas();
});

