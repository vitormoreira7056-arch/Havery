export class UIManager {
    constructor() {
        this.player = {
            level: 60, // Nível 60 para podermos ver alguns liberados e outros bloqueados
            gold: 1658,
            diamond: 12
        };

        this.inventorySettings = {
            equipamentos: { current: 70, max: null, step: 5, cost: 100, curr: 'gold', items: [] },
            materiais: { current: 50, max: null, step: 5, cost: 50, curr: 'gold', items: [] },
            missoes: { current: 35, max: 50, step: 3, cost: 75, curr: 'gold', items: [] },
            pets: { current: 10, max: 30, step: 5, cost: 10, curr: 'diamond', items: [] }
        };

        // --- DADOS DOS TRABALHOS ---
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

        // --- Elementos DOM ---
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

        // Navegação Inferior
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                const targetViewId = `view-${item.getAttribute('data-target')}`;
                
                this.views.forEach(view => {
                    if (view.id === targetViewId) {
                        view.classList.add('active');
                        view.classList.remove('hidden');
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

        // Abas da tela de Trabalhos
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

    // --- LÓGICA DE TRABALHOS (Nova Função) ---
    renderWorkTab() {
        const container = document.getElementById('work-list-container');
        container.innerHTML = '';

        // Filtra os trabalhos dependendo do nível atual do jogador
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
            
            // Renderiza as opções de tempo (a primeira ativa por padrão)
            let timeHtml = '';
            this.timeMultipliers.forEach((t, index) => {
                const activeClass = index === 0 ? 'active' : '';
                timeHtml += `<button class="time-btn ${activeClass}" data-mult="${t.mult}">${t.label}</button>`;
            });

            // Recompensa com base na maestria (Ex: +10% de recompensa por nível de maestria)
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

            // Lógica para alterar o valor recompensado quando clica nos tempos
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

    // --- LÓGICA DE INVENTÁRIO (Mantida) ---
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

window.addEventListener('DOMContentLoaded', () => {
    new UIManager();
});
