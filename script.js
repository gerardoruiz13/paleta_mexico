// --- Elementos del DOM ---
const paletteContainer = document.getElementById('palette-container');
const paletteNameEl = document.getElementById('palette-name');
const generateBtn = document.getElementById('generate-btn');

let palettesData = [];

// --- Lógica Principal ---

// 1. Cargar los datos de las paletas desde el archivo JSON
async function loadPalettes() {
    try {
        const response = await fetch('paletas.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        palettesData = await response.json();
        generateNewPalette(); // Genera la primera paleta al cargar
    } catch (error) {
        console.error("No se pudieron cargar las paletas:", error);
        // Fallback en caso de que el JSON falle
        paletteNameEl.textContent = 'Error al cargar paletas';
        paletteContainer.innerHTML = `<p>Por favor, asegúrese de que el archivo paletas.json exista y esté en la misma carpeta.</p>`;
    }
}

// 2. Generar y mostrar una nueva paleta
function generateNewPalette() {
    if (palettesData.length === 0) return;

    // Selecciona una paleta al azar
    const randomIndex = Math.floor(Math.random() * palettesData.length);
    const selectedPalette = palettesData[randomIndex];

    // Actualiza el nombre de la paleta
    paletteNameEl.textContent = selectedPalette.nombre;
    
    // Limpia el contenedor
    paletteContainer.innerHTML = '';

    // Crea y añade las columnas de color
    selectedPalette.colores.forEach(color => {
        const colorColumn = document.createElement('div');
        colorColumn.classList.add('color-column');
        colorColumn.style.backgroundColor = color;
        
        // Crea el elemento para el código HEX
        const hexCode = document.createElement('span');
        hexCode.classList.add('hex-code');
        hexCode.textContent = color.toUpperCase();
        
        // Crea el feedback de copiado
        const copyFeedback = document.createElement('span');
        copyFeedback.classList.add('copy-feedback');
        copyFeedback.textContent = '¡Copiado!';

        colorColumn.appendChild(hexCode);
        colorColumn.appendChild(copyFeedback);

        // Evento para copiar el color
        colorColumn.addEventListener('click', () => {
            copyToClipboard(color, copyFeedback);
        });

        paletteContainer.appendChild(colorColumn);
    });
}

// 3. Función para copiar al portapapeles
function copyToClipboard(text, feedbackEl) {
    navigator.clipboard.writeText(text).then(() => {
        // Muestra el feedback
        feedbackEl.style.opacity = '1';
        // Oculta el feedback después de un momento
        setTimeout(() => {
            feedbackEl.style.opacity = '0';
        }, 1000);
    }).catch(err => {
        console.error('Error al copiar el texto: ', err);
    });
}


// --- Event Listeners ---
generateBtn.addEventListener('click', generateNewPalette);

// --- Inicio de la aplicación ---
document.addEventListener('DOMContentLoaded', loadPalettes);
