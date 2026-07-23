import { RACES } from './races.js';
import { Entity } from './entity.js';

class TurnBasedEngine {
    constructor() {
        this.player = new Entity(`Aventureiro (${RACES.HUMANO.name})`, RACES.HUMANO.baseStats);
        
        this.spawnEnemy(); // Função separada para instanciar o inimigo
        
        this.ui = {
            // Player
            playerName: document.getElementById('player-name'),
            playerLevel: document.getElementById('player-level'),
            playerHpBar: document.getElementById('player-health-bar'),
            playerHpText: document.getElementById('player-hp-text'),
            playerXpBar: document.getElementById('player-xp-bar'),
            playerXpText: document.getElementById('player-xp-text'),
            playerTalents: document.getElementById('player-talents'),
            
            // Enemy
            enemyName: document.getElementById('enemy-name'),
            enemyHpBar: document.getElementById('enemy-health-bar'),
            enemyHpText: document.getElementById('enemy-hp-text'),
            
            log: document.getElementById('combat-log'),
            buttons: {
                attack: document.getElementById('btn-attack'),
                defend: document.getElementById('btn-defend'),
                heal: document.getElementById('btn-heal')
            }
        };

        this.ui.playerName.innerHTML = `Jogador <span id="player-level" class="level-badge">Lv ${this.player.level}</span>`;
        this.bindEvents();
        this.updateUI();
    }

    spawnEnemy() {
        const goblinStats = { HP: 60, MP: 0, ATK: 12, DF: 2, ESQ: 5 };
        this.enemy = new Entity("Goblin Sombrio", goblinStats);
        // Atribui a XP que o inimigo dará ao morrer
        this.enemy.xpYield = 45; 
        
        if(this.ui) {
            this.ui.enemyName.textContent = this.enemy.name;
        }
    }

    bindEvents() {
        this.ui.buttons.attack.addEventListener('click', () => this.processPlayerTurn('ATTACK'));
        this.ui.buttons.defend.addEventListener('click', () => this.processPlayerTurn('DEFEND'));
        this.ui.buttons.heal.addEventListener('click', () => this.processPlayerTurn('HEAL'));
    }

    logMessage(message, color = "#c5c6c7") {
        const li = document.createElement('li');
        li.textContent = message;
        li.style.color = color;
        this.ui.log.prepend(li);
    }

    updateUI() {
        // UI do Jogador
        this.ui.playerName.innerHTML = `Jogador <span id="player-level" class="level-badge">Lv ${this.player.level}</span>`;
        const playerHpPercent = (this.player.currentHp / this.player.stats.HP) * 100;
        this.ui.playerHpBar.style.width = `${playerHpPercent}%`;
        this.ui.playerHpText.textContent = `${this.player.currentHp} / ${this.player.stats.HP} HP`;

        // UI de XP e Talentos
        if (this.player.level >= this.player.maxLevel) {
            this.ui.playerXpBar.style.width = `100%`;
            this.ui.playerXpText.textContent = `MAX LEVEL`;
        } else {
            const xpPercent = (this.player.xp / this.player.xpRequired) * 100;
            this.ui.playerXpBar.style.width = `${xpPercent}%`;
            this.ui.playerXpText.textContent = `${Math.floor(this.player.xp)} / ${this.player.xpRequired} XP`;
        }
        this.ui.playerTalents.textContent = `Talentos: ${this.player.talentPoints}`;

        // UI do Inimigo
        const enemyHpPercent = (this.enemy.currentHp / this.enemy.stats.HP) * 100;
        this.ui.enemyHpBar.style.width = `${enemyHpPercent}%`;
        this.ui.enemyHpText.textContent = `${this.enemy.currentHp} / ${this.enemy.stats.HP} HP`;
    }

    toggleButtons(state) {
        this.ui.buttons.attack.disabled = !state;
        this.ui.buttons.defend.disabled = !state;
        this.ui.buttons.heal.disabled = !state;
    }

    processPlayerTurn(action) {
        this.player.isDefending = false;
        this.enemy.isDefending = false;

        this.logMessage(`--- Seu Turno ---`, '#66fcf1');

        if (action === 'ATTACK') {
            const damage = this.enemy.takePhysicalDamage(this.player.stats.ATK);
            this.logMessage(`Você atacou com precisão, causando ${damage} de dano!`);
        } else if (action === 'DEFEND') {
            this.player.isDefending = true;
            this.logMessage(`Você ergue o escudo e se prepara para o impacto.`);
        } else if (action === 'HEAL') {
            const healAmount = 25;
            this.player.heal(healAmount);
            this.logMessage(`Você consumiu uma poção e recuperou ${healAmount} de HP.`, '#2ecc71');
        }

        this.updateUI();

        if (this.enemy.currentHp <= 0) {
            this.logMessage(`Vitória! O ${this.enemy.name} foi derrotado.`, '#45a29e');
            
            // Processa o ganho de experiência
            const leveledUp = this.player.gainXp(this.enemy.xpYield);
            this.logMessage(`Você obteve ${this.enemy.xpYield} XP.`, '#f1c40f');
            
            if (leveledUp) {
                this.logMessage(`SUBIU DE NÍVEL! Você atingiu o Nível ${this.player.level}.`, '#f1c40f');
                this.logMessage(`+3 Pontos de Talento!`, '#9b59b6');
            }

            this.updateUI();
            this.toggleButtons(false);
            
            // Faz spawn de um novo inimigo em 2 segundos para testar XP
            setTimeout(() => {
                this.spawnEnemy();
                this.logMessage(`Um novo ${this.enemy.name} se aproximou!`, '#c72c41');
                this.updateUI();
                this.toggleButtons(true);
            }, 2000);
            
            return;
        }

        this.toggleButtons(false);
        setTimeout(() => this.processEnemyTurn(), 1200);
    }

    processEnemyTurn() {
        this.logMessage(`--- Turno do Inimigo ---`, '#c72c41');

        const enemyAction = Math.random() > 0.2 ? 'ATTACK' : 'DEFEND';
        
        if (enemyAction === 'ATTACK') {
            const damage = this.player.takePhysicalDamage(this.enemy.stats.ATK);
            this.logMessage(`O ${this.enemy.name} desferiu um golpe brutal, causando ${damage} de dano!`);
        } else {
            this.enemy.isDefending = true;
            this.logMessage(`O ${this.enemy.name} recua e adota uma postura defensiva.`);
        }

        this.updateUI();

        if (this.player.currentHp <= 0) {
            this.logMessage(`Você foi derrotado... O mundo mergulha nas trevas.`, '#c72c41');
        } else {
            this.toggleButtons(true);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new TurnBasedEngine();
});
