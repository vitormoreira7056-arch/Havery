export class UIManager {
    constructor() {
        // --- Dados Simulados do Jogador ---
        this.player = {
            level: 150, // Mude este valor para testar o desbloqueio dos Talismãs!
            gold: 1658,
            diamond: 12
        };

        this.inventorySettings = {
            equipamentos: { current: 70, max: null, step: 5, cost: 100, curr: 'gold', items: [] },
            materiais: { current: 50, max: null, step: 5, cost: 50, curr: 'gold', items: [] },
            missoes: { current: 35, max: 50, step: 3, cost: 75, curr: 'gold', items: [] },
            pets: { current: 10, max: 30, step: 5, cost: 10, curr: 'diamond', items: [] }
        };

        // --- Elementos DOM ---
        this.btnMenu = document.getElementById('btn-menu');
        this.dropdownMenu = document.getElementById('dropdown-menu');
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = document.querySelectorAll('.view-section');

        this.uiLevel = document.getElementById('ui-level');
        this.uiGold = document.getElementById('ui-gold');
        this.uiDiamond = document.getElementById('ui-diamond');

        this.bindEvents();
        
        // Inicialização das Telas
        this.updatePlayerHUD();
        this.renderAllInventories();
        this.checkTalismanUnlocks();
    }

    updatePlayerHUD() {
        this.uiLevel.textContent = this.player.level;
        this.uiGold.textContent = this.player.gold;
        this.uiDiamond.textContent = this.player.diamond;
    }

    bindEvents() {
        // Menu Suspenso
        this.btnMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!this.dropdownMenu.contains(e.target) && e.target !== this.btnMenu) {
                this.dropdownMenu.classList.add('hidden');
            }
        });

        // Roteador de Telas (Navegação Inferior)
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

        // Botões de Expansão de Inventário
        const expandBtns = document.querySelectorAll('.expand-btn');
        expandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-type');
                this.expandInventory(type, e.target);
            });
        });
    }

    // --- LÓGICA DE DESBLOQUEIO DOS TALISMÃS ---
    checkTalismanUnlocks() {
        const talismanSlots = document.querySelectorAll('.talisman.locked');
        
        talismanSlots.forEach(slot => {
            const unlockLevel = parseInt(slot.getAttribute('data-unlock'));
            
            // Se o nível do player for maior ou igual, desbloqueia
            if (this.player.level >= unlockLevel) {
                slot.classList.remove('locked');
                slot.innerHTML = `<span class="slot-bg">Talismã</span>`;
            }
        });
    }

    // --- LÓGICA DE INVENTÁRIO (Mochila) ---
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
        
        // Verifica se os elementos existem no DOM (evita erro caso estejamos em outra tela)
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
