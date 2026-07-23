import { Player } from './player.js';
import { InputHandler } from './input.js';
import { World } from './world.js';

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configuração da resolução interna do canvas
        this.canvas.width = 800;
        this.canvas.height = 600;

        // Instancia os módulos principais
        this.world = new World(this.canvas.width, this.canvas.height);
        this.player = new Player(384, 300, 'HUMANO'); // Começa no centro do mapa
        this.input = new InputHandler();

        this._bindLoop = this._loop.bind(this);
        this.lastTime = 0;
    }

    start() {
        requestAnimationFrame(this._bindLoop);
    }

    _update() {
        // Obtém a direção de movimento através do input (teclado ou joystick)
        const { dx, dy } = this.input.getAxis();
        
        // Atualiza a posição do player validando os limites do mundo
        this.player.move(dx, dy, this.world.width, this.world.height);
    }

    _render() {
        // Limpa a tela
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha o mundo / cenário
        this.world.draw(this.ctx);

        // Desenha o personagem
        this.player.draw(this.ctx);
    }

    _loop(timestamp) {
        this._update();
        this._render();
        requestAnimationFrame(this._bindLoop);
    }
}

// Inicializa e dispara o motor do jogo assim que o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start();
});
