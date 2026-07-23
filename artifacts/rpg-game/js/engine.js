import { RACES } from './races.js';
import { Entity } from './entity.js';

class TurnBasedEngine {
    constructor() {
        // Inicializa o player com os atributos base da raça mapeada
        this.player = new Entity(`Aventureiro (${RACES.HUMANO.name})`, RACES.HUMANO.baseStats);
        
        // Status base do inimigo utilizando o novo sistema
        const goblinStats = { HP: 60, MP: 0, ATK: 12, DF: 2, ESQ: 5 };
        this.enemy = new Entity("Goblin Sombrio", goblinStats);
        
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
        const playerHpPercent = (this.player.currentHp / this.player.stats.HP) * 100;
        this.ui.playerHpBar.style.width = `${playerHpPercent}%`;
        this.ui.playerHpText.textContent = `${this.player.currentHp} / ${this.player.stats.HP} HP`;

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
            this.toggleButtons(false);
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
