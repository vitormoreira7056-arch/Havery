import { RACES } from './races.js';
import { Entity } from './entity.js';

class TurnBasedEngine {
    constructor() {
        // Inicializa as entidades
        this.player = new Entity(`Aventureiro (${RACES.HUMANO.name})`, RACES.HUMANO.stats);
        
        // Status base do inimigo
        const goblinStats = { hp: 60, attack: 12, defense: 2 };
        this.enemy = new Entity("Goblin Sombrio", goblinStats);
        
        // Captura os elementos de interface
        this.ui = {
            playerName: document.getElementById('player-name'),
            playerHpBar: document.getElementById('player-health-bar'),
            playerHpText: document.getElementById('player-hp-text'),
            
            enemyHpBar: document.getElementById('enemy-health-bar'),
            enemyHpText: document.getElementById('enemy-hp-text'),
            
            log: document.getElementById('combat-log'),
            
            buttons: {
                attack: document.getElementById('btn-attack'),
                defend: document.getElementById('btn-defend'),
                heal: document.getElementById('btn-heal')
            }
        };

        this.ui.playerName.textContent = this.player.name;

        this.bindEvents();
        this.updateUI();
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
        // Atualiza barras de vida
        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        this.ui.playerHpBar.style.width = `${playerHpPercent}%`;
        this.ui.playerHpText.textContent = `${this.player.hp} / ${this.player.maxHp} HP`;

        const enemyHpPercent = (this.enemy.hp / this.enemy.maxHp) * 100;
        this.ui.enemyHpBar.style.width = `${enemyHpPercent}%`;
        this.ui.enemyHpText.textContent = `${this.enemy.hp} / ${this.enemy.maxHp} HP`;
    }

    toggleButtons(state) {
        this.ui.buttons.attack.disabled = !state;
        this.ui.buttons.defend.disabled = !state;
        this.ui.buttons.heal.disabled = !state;
    }

    processPlayerTurn(action) {
        // Reseta as posturas de defesa no início do turno
        this.player.isDefending = false;
        this.enemy.isDefending = false;

        this.logMessage(`--- Seu Turno ---`, '#66fcf1');

        if (action === 'ATTACK') {
            const damage = this.enemy.takeDamage(this.player.attack);
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

        // Checa se o inimigo morreu
        if (this.enemy.hp <= 0) {
            this.logMessage(`Vitória! O ${this.enemy.name} foi derrotado.`, '#45a29e');
            this.toggleButtons(false);
            return;
        }

        // Passa o turno para o inimigo
        this.toggleButtons(false);
        setTimeout(() => this.processEnemyTurn(), 1200);
    }

    processEnemyTurn() {
        this.logMessage(`--- Turno do Inimigo ---`, '#c72c41');

        // IA Simples: 80% de chance de atacar, 20% de se defender
        const enemyAction = Math.random() > 0.2 ? 'ATTACK' : 'DEFEND';
        
        if (enemyAction === 'ATTACK') {
            const damage = this.player.takeDamage(this.enemy.attack);
            this.logMessage(`O ${this.enemy.name} desferiu um golpe brutal, causando ${damage} de dano!`);
        } else {
            this.enemy.isDefending = true;
            this.logMessage(`O ${this.enemy.name} recua e adota uma postura defensiva.`);
        }

        this.updateUI();

        // Checa se o jogador morreu
        if (this.player.hp <= 0) {
            this.logMessage(`Você foi derrotado... O mundo mergulha nas trevas.`, '#c72c41');
        } else {
            // Devolve o turno ao jogador
            this.toggleButtons(true);
        }
    }
}

// Inicializa a engine quando o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
    new TurnBasedEngine();
});
