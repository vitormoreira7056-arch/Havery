import { headerHTML } from './header.js';
import { viewsHTML } from './views.js';

export class UIManager {
    constructor() {
        this.player = {
            level: 60,
            gold: 1658,
            diamond: 12
        };

        this.inventorySettings = {
            equipamentos: { current: 70, max: null, step: 5, cost: 100, curr: 'gold', items: [] },
            materiais: { current: 50, max: null, step: 5, cost: 50, curr: 'gold', items: [] },
            missoes: { current: 35, max: 50, step: 3, cost: 75, curr: 'gold', items: [] },
            pets: { current: 10, max: 30, step: 5, cost: 10, curr: 'diamond', items: [] }
        };

        // --- MAPA MUNDO (Coordenadas ajustadas para o novo mapa) ---
        this.worldLocations = [
            // Capitais Centrais
            { id: 'erins', name: 'Erins', type: 'capital', x: 50, y: 38, desc: 'A capital central de Dreht, erguida ao redor do grande cristal místico.' },
            { id: 'erinia', name: 'Erinia', type: 'capital', x: 51, y: 64, desc: 'A segunda maior fortaleza do continente, lar dos cavaleiros reais.' },
            
            // Cidades e Vilas Continentais
            { id: 'joree', name: 'Joree', type: 'cidade', x: 55, y: 15, desc: 'Vila pacífica escondida na grande floresta do norte.' },
            { id: 'dorrene', name: 'Dorrene', type: 'cidade', x: 33, y: 22, desc: 'A joia do deserto. Conhecida por seus mercados de especiarias.' },
            { id: 'alena', name: 'Alena', type: 'cidade', x: 79, y: 28, desc: 'Cidade portuária, porta de entrada para os mares do leste.' },
            { id: 'sutalisco', name: 'Sutalisco', type: 'cidade', x: 78, y: 46, desc: 'Maior polo comercial das planícies orientais.' },
            { id: 'bareon', name: 'Bareon', type: 'cidade', x: 41, y: 55, desc: 'Posto avançado militar próximo ao Lago Prateado.' },
            { id: 'porto_salmar', name: 'Porto de Salmar', type: 'cidade', x: 17, y: 37, desc: 'Principal porto pesqueiro na costa oeste do continente.' },
            { id: 'zarvath', name: 'Zarvath', type: 'cidade', x: 53, y: 92, desc: 'Polo mercante do extremo sul, banhado por águas quentes.' },
            { id: 'refugio_piratas', name: 'Refúgio dos Piratas', type: 'cidade', x: 26, y: 85, desc: 'Baía escondida, porto seguro para contrabandistas e saqueadores.' },
            
            // Reinos Distantes
            { id: 'aqualon', name: 'Aqualon', type: 'capital', x: 94, y: 70, desc: 'A majestosa cidade insular, capital inquestionável dos mares.' },
            { id: 'alfheim', name: 'Alfheim', type: 'capital', x: 75, y: 18, desc: 'A grandiosa e reclusa capital dos altos elfos.' },
            
            // Masmorras e Zonas de Perigo
            { id: 'picos_flamejantes', name: 'Picos Flamejantes', type: 'perigo', x: 17, y: 11, desc: 'Vulcões ativos que abrigam dragões e elementais de fogo.' },
            { id: 'minas_ferro', name: 'Minas de Ferro', type: 'dungeon', x: 13, y: 18, desc: 'Maior fonte de minérios do continente, tomada por bestas.' },
            { id: 'deserto_arak', name: 'Deserto de Arak', type: 'perigo', x: 13, y: 50, desc: 'Dunas escaldantes onde impérios antigos estão enterrados.' },
            { id: 'templo_deuses', name: 'Templo dos Deuses', type: 'dungeon', x: 15, y: 63, desc: 'Um templo ancestral esquecido nas areias impiedosas.' },
            { id: 'fortaleza_sombras', name: 'Fortaleza das Sombras', type: 'perigo', x: 80, y: 82, desc: 'Domínio corrompido por magia obscura e lordes necromantes.' },
            { id: 'niflheim', name: 'Niflheim', type: 'dungeon', x: 88, y: 11, desc: 'Castelo congelado nos confins mais hostis do oceano nórdico.' },
            { id: 'coroa_gelo', name: 'Coroa do Gelo', type: 'perigo', x: 45, y: 6, desc: 'O pico mais alto e gelado do mundo, lar de feras da neve.' },
            { id: 'floresta_thorn', name: 'Floresta de Thorn', type: 'perigo', x: 86, y: 56, desc: 'Um bosque denso e sombrio, repleto de criaturas selvagens.' },
            { id: 'ruinas_zarth', name: 'Ruínas de Zarth', type: 'dungeon', x: 17, y: 77, desc: 'Resquícios de uma civilização reptiliana engolida pela selva.' },
            { id: 'ilha_eco', name: 'Ilha do Eco', type: 'dungeon', x: 6, y: 30, desc: 'Pequena ilha misteriosa de onde cantos fantasmagóricos ecoam.' }
        ];

        this.jobsData = [
            { id: 1, name: 'Ajudante de mercado', reqLevel: 1, stamina: 4, currType: 'copper', baseReward: 150, baseXP: 50, mastery: 1, maxMastery: 10 },
            { id: 2, name: 'Entregador de cartas', reqLevel: 5, stamina: 11, currType: 'copper', baseReward: 300, baseXP: 100, mastery: 2, maxMastery: 10 },
            { id: 3, name: 'Coletor de lenha', reqLevel: 10, stamina: 18, currType: 'copper', baseReward: 550, baseXP: 220, mastery: 1, maxMastery: 10 },
            { id: 4, name: 'Coletor de ervas', reqLevel: 20, stamina: 25, currType: 'copper', baseReward: 900, baseXP: 450, mastery: 1, maxMastery: 10 },
            { id: 5, name: 'Carregador de caixas', reqLevel: 30, stamina: 32, currType: 'copper', baseReward: 1400, baseXP: 750, mastery: 1, maxMastery: 10 },
            { id: 6, name: 'Pescador', reqLevel: 40, stamina: 39, currType: 'copper', baseReward: 2000, baseXP: 1100, mastery: 1, maxMastery: 10 },
            { id: 7, name: 'Vigia da floresta', reqLevel: 50, stamina: 46, currType: 'copper', baseReward: 2800, baseXP: 1600, mastery: 1, maxMastery: 10 },
            { id: 8, name: 'Vigia do portão', reqLevel: 65, stamina: 52, currType: 'copper', baseReward: 4000, baseXP: 2400, mastery: 1, maxMastery: 10 },
            { id: 9, name: 'Auxiliar na mina', reqLevel: 75, stamina: 59, currType: 'copper', baseReward: 5500, baseXP: 3500, mastery: 1, maxMastery: 10 },
            { id: 10, name: 'Mensageiro real', reqLevel: 90, stamina: 66, currType: 'bronze', baseReward: 800, baseXP: 5000, mastery: 1, maxMastery: 10 },
            { id: 11, name: 'Mercenário do rei', reqLevel: 120, stamina: 73, currType: 'bronze', baseReward: 1500, baseXP: 8000, mastery: 1, maxMastery: 10 },
            { id: 12, name: 'Emissário do rei', reqLevel: 150, stamina: 80, currType: 'bronze', baseReward: 3000, baseXP: 15000, mastery: 1, maxMastery: 10 }
        ];

        this.timeMultipliers = [
            { label: '10m', mult: 1 },
            { label: '30m', mult: 3 },
            { label: '2h', mult: 12 },
            { label: '4h', mult: 25 },
            { label: '6h', mult: 40 }
        ];

        this.currentWorkTab = 'para-voce';
    }

    initDOM() {
        this.btnMenu = document.getElementById('btn-menu');
        this.dropdownMenu = document.getElementById('dropdown-menu');
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = document.querySelectorAll('.view-section');

        this.uiLevel = document.getElementById('ui-level');
        this.uiGold = document.getElementById('ui-gold');
        this.uiDiamond = document.getElementById('ui-diamond');

        this.bindEvents();
        this.updatePlayerHUD();
        this.renderAllInventories();
        this.checkTalismanUnlocks();
        this.renderWorkTab();
        
        // Inicializa o novo sistema do Mapa
        this.initMapSystem();
    }

    updatePlayerHUD() {
        this.uiLevel.textContent = this.player.level;
        this.uiGold.textContent = this.player.gold;
        this.uiDiamond.textContent = this.player.diamond;
    }

    bindEvents() {
        this.btnMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!this.dropdownMenu.contains(e.target) && e.target !== this.btnMenu) {
                this.dropdownMenu.classList.add('hidden');
            }
        });

        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                const targetViewId = `view-${item.getAttribute('data-target')}`;
                
                this.views.forEach(view => {
                    if (view.id === targetViewId) {
                        view.classList.add('active');
                        view.classList.remove('hidden');
                        
                        // Scrolla o mapa para o centro (Erins) ao abrir
                        if(targetViewId === 'view-mapa') {
                            this.centerMapViewport();
                        }
                    } else {
                        view.classList.remove('active');
                        view.classList.add('hidden');
                    }
                });
            });
        });

        const expandBtns = document.querySelectorAll('.expand-btn');
        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-type');
                this.expandInventory(type, e.target);
            });
        });

        const workTabs = document.querySelectorAll('.work-tab');
        workTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                workTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentWorkTab = e.target.getAttribute('data-work-tab');
                this.renderWorkTab();
            });
        });
    }

    // --- SISTEMA GIGANTE DO MAPA ---
    initMapSystem() {
        const mapWorld = document.getElementById('map-world');
        if(!mapWorld) return;

        mapWorld.innerHTML = ''; // Limpa antes de renderizar

        this.worldLocations.forEach(loc => {
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
    }

    centerMapViewport() {
        const viewport = document.getElementById('map-viewport');
        const world = document.getElementById('map-world');
        if(viewport && world) {
            // Centraliza aproximadamente na posição de Erins (50%, 38%)
            viewport.scrollLeft = (world.offsetWidth * 0.50) - (viewport.offsetWidth / 2);
            viewport.scrollTop = (world.offsetHeight * 0.38) - (viewport.offsetHeight / 2);
        }
    }

    // --- OUTROS SISTEMAS ---
    renderWorkTab() {
        const container = document.getElementById('work-list-container');
        if (!container) return;
        container.innerHTML = '';

        const availableJobs = this.jobsData.filter(job => job.reqLevel <= this.player.level);
        const lockedJobs = this.jobsData.filter(job => job.reqLevel > this.player.level);

        document.getElementById('count-voce').textContent = availableJobs.length;
        document.getElementById('count-proximos').textContent = lockedJobs.length;

        let jobsToRender = [];
        if (this.currentWorkTab === 'para-voce') jobsToRender = availableJobs;
        else if (this.currentWorkTab === 'proximos') jobsToRender = lockedJobs;

        jobsToRender.forEach(job => {
            const card = document.createElement('div');
            card.className = `work-card ${this.currentWorkTab === 'proximos' ? 'locked' : ''}`;
            
            let timeHtml = '';
            this.timeMultipliers.forEach((t, index) => {
                const activeClass = index === 0 ? 'active' : '';
                timeHtml += `<button class="time-btn ${activeClass}" data-mult="${t.mult}">${t.label}</button>`;
            });

            const masteryMultiplier = 1 + ((job.mastery - 1) * 0.1);
            const displayReward = Math.floor(job.baseReward * masteryMultiplier);
            const currIcon = job.currType === 'copper' ? '🟤' : '🟠';

            card.innerHTML = `
                <div class="work-header">
                    <div class="work-img-placeholder">⚒️</div>
                    <div class="work-details">
                        <h3>${job.name}</h3>
                        <div class="work-meta">
                            <span>Nv.${job.reqLevel}</span>
                            <span style="color:#4caf50;">⚡ ${job.stamina}</span>
                        </div>
                        <div class="work-reward">
                            <span class="curr-icon">${currIcon}</span> +<span class="reward-val">${displayReward}</span>
                        </div>
                        <div class="mastery-progress-box">
                            <span class="m-level">⭐ Maestria ${job.mastery}/${job.maxMastery}</span>
                            <div class="m-track"><div class="m-fill" style="width: ${(job.mastery/job.maxMastery)*100}%;"></div></div>
                        </div>
                    </div>
                </div>
                <div class="work-actions">
                    <div class="time-selectors">${timeHtml}</div>
                    <button class="btn-start-work">Iniciar</button>
                </div>
            `;

            if (this.currentWorkTab === 'para-voce') {
                const timeBtns = card.querySelectorAll('.time-btn');
                const rewardValDisplay = card.querySelector('.reward-val');

                timeBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        timeBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const mult = parseInt(btn.getAttribute('data-mult'));
                        rewardValDisplay.textContent = Math.floor(displayReward * mult);
                    });
                });

                const startBtn = card.querySelector('.btn-start-work');
                startBtn.addEventListener('click', () => {
                    alert(`Iniciou trabalho: ${job.name}.`);
                });
            }

            container.appendChild(card);
        });
    }

    checkTalismanUnlocks() {
        const talismanSlots = document.querySelectorAll('.talisman.locked');
        talismanSlots.forEach(slot => {
            const unlockLevel = parseInt(slot.getAttribute('data-unlock'));
            if (this.player.level >= unlockLevel) {
                slot.classList.remove('locked');
                slot.innerHTML = `<span class="slot-bg">Talismã</span>`;
            }
        });
    }

    renderAllInventories() {
        this.renderInventoryGrid('equipamentos');
        this.renderInventoryGrid('materiais');
        this.renderInventoryGrid('missoes');
        this.renderInventoryGrid('pets');
    }

    renderInventoryGrid(type) {
        const config = this.inventorySettings[type];
        const grid = document.getElementById(`grid-${type}`);
        const countText = document.getElementById(`count-${type}`);
        
        if(!grid) return; 

        grid.innerHTML = ''; 
        countText.textContent = `${config.items.length}/${config.current}`;

        for (let i = 0; i < config.current; i++) {
            const slot = document.createElement('div');
            slot.className = 'inv-slot';
            grid.appendChild(slot);
        }
    }

    expandInventory(type, buttonElement) {
        const config = this.inventorySettings[type];
        
        if (config.max !== null && config.current >= config.max) {
            alert("Limite máximo de espaço alcançado!");
            buttonElement.disabled = true;
            buttonElement.textContent = "MÁXIMO";
            return;
        }

        if (config.curr === 'gold') {
            if (this.player.gold >= config.cost) {
                this.player.gold -= config.cost;
            } else {
                alert(`Ouro insuficiente! Necessário: ${config.cost}`);
                return;
            }
        } else if (config.curr === 'diamond') {
            if (this.player.diamond >= config.cost) {
                this.player.diamond -= config.cost;
            } else {
                alert(`Diamantes insuficientes! Necessário: ${config.cost}`);
                return;
            }
        }

        config.current += config.step;
        
        if (config.max !== null && config.current >= config.max) {
            config.current = config.max;
            buttonElement.disabled = true;
            buttonElement.textContent = "MÁXIMO";
        }

        config.cost = Math.floor(config.cost * 1.5);
        this.updatePlayerHUD();
        this.renderInventoryGrid(type);
    }
}

// Injeção modular
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const headerModule = await import('./header.js');
        document.getElementById('header-placeholder').outerHTML = headerModule.headerHTML;

        const viewsModule = await import('./views.js');
        document.getElementById('views-placeholder').outerHTML = viewsModule.viewsHTML;

        const ui = new UIManager();
        ui.initDOM();
    } catch (error) {
        console.error("Erro no carregamento modular:", error);
    }
});
