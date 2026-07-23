import { WORLD_LOCATIONS } from './data.js';

export class MapEngine {
    constructor() {
        this.locations = WORLD_LOCATIONS;
        this.mapScale = 0.4;
        this.minScale = 0.2;
        this.maxScale = 1.5;
        this.initialPinchDistance = null;
        this.startScale = 0.4;
    }

    init() {
        const mapWorld = document.getElementById('map-world');
        const viewport = document.getElementById('map-viewport');
        if(!mapWorld || !viewport) return;

        mapWorld.innerHTML = ''; 

        // Renderiza as Localizações
        this.locations.forEach(loc => {
            const node = document.createElement('div');
            node.className = `map-node type-${loc.type}`;
            node.style.left = `${loc.x}%`;
            node.style.top = `${loc.y}%`;
            node.setAttribute('data-id', loc.id);
            
            node.innerHTML = `
                <div class="node-indicator"></div>
                <div class="node-label">${loc.name}</div>
            `;

            node.addEventListener('click', () => {
                document.querySelectorAll('.map-node').forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                
                document.getElementById('map-empty-state').style.display = 'none';
                const details = document.getElementById('map-details-state');
                details.classList.add('active');
                
                document.getElementById('loc-name').textContent = loc.name;
                document.getElementById('loc-desc').textContent = loc.desc;
            });

            mapWorld.appendChild(node);
        });

        document.getElementById('btn-viajar')?.addEventListener('click', () => {
            const locName = document.getElementById('loc-name').textContent;
            alert(`Iniciando viagem para ${locName}...`);
        });

        this.bindZoomEvents(viewport);
    }

    bindZoomEvents(viewport) {
        // Botões Virtuais
        document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
            this.mapScale = Math.min(this.mapScale + 0.2, this.maxScale);
            this.applyScale();
        });

        document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
            this.mapScale = Math.max(this.mapScale - 0.2, this.minScale);
            this.applyScale();
        });

        // Touch Pinch Zoom
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                this.initialPinchDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                this.startScale = this.mapScale;
            }
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && this.initialPinchDistance) {
                e.preventDefault(); 
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const scaleChange = currentDistance / this.initialPinchDistance;
                this.mapScale = Math.min(Math.max(this.startScale * scaleChange, this.minScale), this.maxScale);
                this.applyScale();
            }
        }, { passive: false });

        viewport.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) this.initialPinchDistance = null;
        });

        // Scroll Mouse (Ctrl + Wheel)
        viewport.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;
                this.mapScale = Math.min(Math.max(this.mapScale * zoomAmount, this.minScale), this.maxScale);
                this.applyScale();
            }
        }, { passive: false });
    }

    applyScale() {
        const scaleWrapper = document.getElementById('map-scale-wrapper');
        const mapWorld = document.getElementById('map-world');
        if (scaleWrapper && mapWorld) {
            scaleWrapper.style.width = `${3000 * this.mapScale}px`;
            scaleWrapper.style.height = `${2250 * this.mapScale}px`;
            mapWorld.style.transform = `scale(${this.mapScale})`;
        }
    }

    centerViewport() {
        const viewport = document.getElementById('map-viewport');
        if(viewport) {
            const scaledWidth = 3000 * this.mapScale;
            const scaledHeight = 2250 * this.mapScale;
            viewport.scrollLeft = (scaledWidth * 0.55) - (viewport.offsetWidth / 2);
            viewport.scrollTop = (scaledHeight * 0.35) - (viewport.offsetHeight / 2);
        }
    }
}
