import { headerHTML } from './header.js';
import { viewsHTML } from './views.js';
import { INVENTORY_SETTINGS, JOBS_DATA, TIME_MULTIPLIERS } from './data.js';
import { MapEngine } from './map.js';

export class UIManager {
    constructor() {
        this.player = {
            level: 60,
            gold: 1658,
            diamond: 12
        };

        // Carrega configurações dos arquivos de dados
        this.inventorySettings = INVENTORY_SETTINGS;
        this.jobsData = JOBS_DATA;
        this.timeMultipliers = TIME_MULTIPLIERS;
        this.currentWorkTab = 'para-voce';
        
        // Instancia o novo Motor do Mapa
        this.mapEngine = new MapEngine();
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
        
        // Inicializa interações no Motor de Mapa Separado
        this.mapEngine.init();
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
                        
                        // Direciona o scroll ao abrir a view do mapa
                        if(targetViewId === 'view-mapa') {
                            this.mapEngine.applyScale();
                            setTimeout(() => this.mapEngine.centerViewport(), 50);
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
                    alert(`Iniciou trabalho: ${job.name}. Você não pode fazer missões enquanto trabalha.`);
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
