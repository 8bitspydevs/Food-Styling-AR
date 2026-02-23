const modelsData = [
    {
        id: 'burger',
        name: 'Hamburguesa',
        src: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
        iosSrc: '',
        thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
        accentColor: '#4caf50'
    },
    {
        id: 'cake',
        name: 'Pastel',
        src: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
        iosSrc: '',
        thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300&auto=format&fit=crop',
        accentColor: '#e91e63'
    },
    {
        id: 'coffee',
        name: 'Sillón',
        src: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb',
        iosSrc: '',
        thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300&auto=format&fit=crop',
        accentColor: '#795548'
    },
    {
        id: 'donut',
        name: 'Teléfono',
        src: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb',
        iosSrc: '',
        thumbnail: 'https://images.unsplash.com/photo-1551025073-61b470bdc5fc?q=80&w=300&auto=format&fit=crop',
        accentColor: '#9c27b0'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('models-carousel');
    const modelViewer = document.getElementById('main-viewer');
    const loader = document.getElementById('loader');
    const bgCircle = document.getElementById('bg-circle-1');

    // Inicializar catálogo
    function renderCarousel() {
        modelsData.forEach((model, index) => {
            const card = document.createElement('div');
            card.className = `model-card ${index === 0 ? 'active' : ''}`;
            card.dataset.id = model.id;

            card.innerHTML = `
                <img src="${model.thumbnail}" alt="${model.name}">
                <div class="model-name">${model.name}</div>
            `;

            card.addEventListener('click', () => selectModel(model, card));
            carousel.appendChild(card);
        });
    }

    // Funcionalidad de selección de modelo
    function selectModel(model, selectedCardElement) {
        // Actualizar UI
        document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
        selectedCardElement.classList.add('active');

        // Efecto visual de fondo
        bgCircle.style.background = `radial-gradient(circle, ${model.accentColor} 0%, transparent 70%)`;

        // Mostrar loader
        loader.classList.add('active');

        // Cambiar modelo en el viewer
        modelViewer.src = model.src;
        if (model.iosSrc) {
            modelViewer.iosSrc = model.iosSrc;
        } else {
            modelViewer.removeAttribute('ios-src');
        }
        modelViewer.alt = `Modelo 3D de ${model.name}`;
    }

    // Escuchar eventos de carga del model-viewer
    modelViewer.addEventListener('load', () => {
        loader.classList.remove('active');
    });

    modelViewer.addEventListener('error', (error) => {
        loader.classList.remove('active');
        console.error('Error al cargar el modelo 3D', error);
        // Opcional: Mostrar un toast o mensaje al usuario
    });

    // Iniciar
    renderCarousel();

    // Configurar AR prompt (Nativo)
    modelViewer.addEventListener('ar-status', (event) => {
        if (event.detail.status === 'session-started') {
            document.getElementById('ar-prompt').style.display = 'block';
        } else {
            document.getElementById('ar-prompt').style.display = 'none';
        }
    });

    // Comprobar soporte de AR (WebXR o Quick Look)
    setTimeout(() => {
        if (!modelViewer.canActivateAR) {
            const qrFallback = document.getElementById('qr-fallback');
            if (qrFallback) {
                // Generar QR apuntando al túnel seguro o IP local
                let targetUrl = window.location.href;

                // Si estamos en localhost, tratamos de usar la IP local para que sea accesible desde el móvil
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    // Nota: 192.168.100.106 es tu IP local detectada
                    targetUrl = 'http://192.168.100.106:5173';
                }

                document.getElementById('qr-code-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(targetUrl)}`;
                qrFallback.style.display = 'flex';
            }
        }
    }, 1500);

});
