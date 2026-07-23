import { RACES } from './races.js';

export class Player {
    constructor(x, y, raceKey = 'HUMANO') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 3;
        
        this.race = RACES[raceKey] || RACES.HUMANO;
        this.hp = this.race.bonus.hp;
        this.maxHp = this.race.bonus.hp;
        
        this.direction = 'DOWN';
    }

    move(dx, dy, mapWidth, mapHeight) {
        const currentSpeed = this.speed * this.race.bonus.speed;
        
        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;

        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > mapWidth) this.x = mapWidth - this.width;
        if (this.y + this.height > mapHeight) this.y = mapHeight - this.height;

        if (dx !== 0 || dy !== 0) {
            if (Math.abs(dx) > Math.abs(dy)) {
                this.direction = dx > 0 ? 'RIGHT' : 'LEFT';
            } else {
                this.direction = dy > 0 ? 'DOWN' : 'UP';
            }
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Sombra suave no chão
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 28, 10, 0, Math.PI * 2);
        ctx.fill();

        // Manto / Capa Dark Fantasy
        ctx.fillStyle = '#2c1e3b';
        ctx.fillRect(this.x + 4, this.y + 10, 24, 18);

        // Corpo / Armadura com detalhe central místico
        ctx.fillStyle = '#513d6a';
        ctx.fillRect(this.x + 8, this.y + 12, 16, 14);
        
        ctx.fillStyle = '#8a4fff';
        ctx.fillRect(this.x + 14, this.y + 16, 4, 4);

        // Cabeça / Capuz
        ctx.fillStyle = '#39264f';
        ctx.fillRect(this.x + 7, this.y + 4, 18, 12);

        // Olhos brilhantes característica Dark Fantasy
        ctx.fillStyle = '#ff3366';
        if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 10, this.y + 9, 3, 2);
            ctx.fillRect(this.x + 19, this.y + 9, 3, 2);
        } else if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 20, this.y + 9, 3, 2);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 9, this.y + 9, 3, 2);
        }

        // Arma / Espada detalhada na lateral baseada na direção
        ctx.fillStyle = '#c0c0c0';
        if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 24, this.y + 12, 2, 12);
            ctx.fillStyle = '#5a3d28';
            ctx.fillRect(this.x + 24, this.y + 10, 2, 2);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 6, this.y + 12, 2, 12);
            ctx.fillStyle = '#5a3d28';
            ctx.fillRect(this.x + 6, this.y + 10, 2, 2);
        } else if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 26, this.y + 14, 2, 10);
        } else {
            ctx.fillRect(this.x + 4, this.y + 14, 2, 10);
        }

        // Barra de Vida Estilizada
        ctx.fillStyle = 'rgba(10, 5, 15, 0.8)';
        ctx.fillRect(this.x - 2, this.y - 8, 36, 5);
        ctx.fillStyle = '#ff3366';
        ctx.fillRect(this.x - 1, this.y - 7, (this.hp / this.maxHp) * 34, 3);

        ctx.restore();
    }
}
