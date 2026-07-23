import { Player } from './player.js';
import { InputHandler } from './input.js';
import { World } from './world.js';

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Resolução interna da tela (viewport)
        this.canvas.width = 800;
        this.canvas.height = 600;

        // Mundo expandido (2400 x 1800)
        this.world = new World(2400, 1800);
        
        // Posiciona o player no centro da praça principal do mapa expandido
        this.player = new Player(1184, 880, 'HUMANO'); 
        this.input = new InputHandler();

        // Configuração da Câmera
        this.camera = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        };

        this._bindLoop = this._loop.bind(this);
    }

    start() {
        requestAnimationFrame(this._bindLoop);
    }

    _update() {
        const { dx, dy } = this.input.getAxis();
        this.player.move(dx, dy, this.world.width, this.world.height);

        // Atualiza a posição da câmera para centralizar no player
        this.camera.x = this.player.x + (this.player.width / 2) - (this.camera.width / 2);
        this.camera.y = this.player.y + (this.player.height / 2) - (this.camera.height / 2);

        // Trava a câmera nos limites do mapa expandido
        if (this.camera.x < 0) this.camera.x = 0;
        if (this.camera.y < 0) this.camera.y = 0;
        if (this.camera.x > this.world.width - this.camera.width) {
            this.camera.x = this.world.width - this.camera.width;
        }
        if (this.camera.y > this.world.height - this.camera.height) {
            this.camera.y = this.world.height - this.camera.height;
        }
    }

    _render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        // Aplica o deslocamento da câmera
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Desenha o mundo expandido
        this.world.draw(this.ctx);

        // Desenha o player aprimorado
        this.player.draw(this.ctx);

        this.ctx.restore();
    }

    _loop(timestamp) {
        this._update();
        this._render();
        requestAnimationFrame(this._bindLoop);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.start();
});
