import { RACES } from './races.js';

export class Player {
    constructor(x, y, raceKey = 'HUMANO') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 3.5;
        
        this.race = RACES[raceKey] || RACES.HUMANO;
        this.hp = this.race.bonus.hp;
        this.maxHp = this.race.bonus.hp;
        
        this.direction = 'DOWN';
        this.isMoving = false;
        this.animTimer = 0;
    }

    move(dx, dy, mapWidth, mapHeight) {
        const currentSpeed = this.speed * this.race.bonus.speed;
        
        if (dx !== 0 || dy !== 0) {
            this.isMoving = true;
            this.animTimer += 0.18;
        } else {
            this.isMoving = false;
            this.animTimer = 0;
        }

        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;

        // Limites do mapa expandido
        if (this.x < 30) this.x = 30;
        if (this.y < 30) this.y = 30;
        if (this.x + this.width > mapWidth - 30) this.x = mapWidth - 30 - this.width;
        if (this.y + this.height > mapHeight - 30) this.y = mapHeight - 30 - this.height;

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
        
        // Efeito de movimento (bobbing) ao caminhar
        let bob = this.isMoving ? Math.sin(this.animTimer * 5) * 2.5 : 0;
        let renderY = this.y + bob;

        // Sombra suave no chão
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y + 30, 12, 0, Math.PI * 2);
        ctx.fill();

        // Manto / Capa Dark Fantasy flutuando levemente
        ctx.fillStyle = '#221530';
        if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 6, renderY + 8, 20, 18);
        } else if (this.direction === 'UP') {
            ctx.fillRect(this.x + 6, renderY + 12, 20, 16);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 10, renderY + 10, 18, 16);
        } else {
            ctx.fillRect(this.x + 4, renderY + 10, 18, 16);
        }

        // Corpo / Armadura com detalhes avançados
        ctx.fillStyle = '#483563';
        ctx.fillRect(this.x + 8, renderY + 12, 16, 14);
        
        // Gema Mística Central
        ctx.fillStyle = '#9b51e0';
        ctx.fillRect(this.x + 14, renderY + 16, 4, 4);

        // Ombreiras
        ctx.fillStyle = '#6b518c';
        ctx.fillRect(this.x + 6, renderY + 11, 6, 4);
        ctx.fillRect(this.x + 20, renderY + 11, 6, 4);

        // Cabeça / Capuz
        ctx.fillStyle = '#321f47';
        ctx.fillRect(this.x + 7, renderY + 3, 18, 12);

        // Olhos brilhantes penetrantes
        ctx.fillStyle = '#ff2a5f';
        ctx.shadowColor = '#ff2a5f';
        ctx.shadowBlur = 6;
        if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 10, renderY + 8, 3, 2);
            ctx.fillRect(this.x + 19, renderY + 8, 3, 2);
        } else if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 20, renderY + 8, 3, 2);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 9, renderY + 8, 3, 2);
        }
        ctx.shadowBlur = 0;

        // Espada Rúnica detalhada na lateral
        ctx.fillStyle = '#a6b1e1';
        if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 25, renderY + 10, 2, 14);
            ctx.fillStyle = '#e8a87c';
            ctx.fillRect(this.x + 25, renderY + 9, 2, 2);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 5, renderY + 10, 2, 14);
            ctx.fillStyle = '#e8a87c';
            ctx.fillRect(this.x + 5, renderY + 9, 2, 2);
        } else if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 27, renderY + 13, 2, 12);
        } else {
            ctx.fillRect(this.x + 3, renderY + 13, 2, 12);
        }

        // Barra de Vida Estilizada
        ctx.fillStyle = 'rgba(10, 5, 15, 0.85)';
        ctx.fillRect(this.x - 4, renderY - 12, 40, 5);
        ctx.fillStyle = '#ff2a5f';
        ctx.fillRect(this.x - 3, renderY - 11, (this.hp / this.maxHp) * 38, 3);

        ctx.restore();
    }
}
