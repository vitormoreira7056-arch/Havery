import { RACES } from './races.js';

export class Player {
    constructor(x, y, raceKey = 'HUMANO') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 3;
        
        // Atribui raça e configurações
        this.race = RACES[raceKey] || RACES.HUMANO;
        this.hp = this.race.bonus.hp;
        this.maxHp = this.race.bonus.hp;
        
        // Direção visual ('DOWN', 'UP', 'LEFT', 'RIGHT')
        this.direction = 'DOWN';
    }

    move(dx, dy, mapWidth, mapHeight) {
        // Aplica velocidade considerando o bônus da raça
        const currentSpeed = this.speed * this.race.bonus.speed;
        
        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;

        // Limites do mapa/canvas da cidade inicial
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > mapWidth) this.x = mapWidth - this.width;
        if (this.y + this.height > mapHeight) this.y = mapHeight - this.height;

        // Atualiza direção para futuras animações/sprites
        if (dx > 0) this.direction = 'RIGHT';
        else if (dx < 0) this.direction = 'LEFT';
        else if (dy > 0) this.direction = 'DOWN';
        else if (dy < 0) this.direction = 'UP';
    }

    draw(ctx) {
        // Placeholder visual profissional em Pixel Art (Substituir posteriormente por spritesheet)
        ctx.fillStyle = '#b83b5e'; // Tom corpóreo / armadura escura
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Detalhe visual simulando o elmo/cabeça na direção apontada
        ctx.fillStyle = '#3f2b4c';
        let headX = this.x + 8;
        let headY = this.y + 4;
        if (this.direction === 'LEFT') headX = this.x + 4;
        if (this.direction === 'RIGHT') headX = this.x + 16;
        if (this.direction === 'UP') headY = this.y;
        
        ctx.fillRect(headX, headY, 12, 10);

        // Indicador de Vida simples acima do player
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x - 4, this.y - 10, 40, 6);
        ctx.fillStyle = '#4ecca3';
        ctx.fillRect(this.x - 3, this.y - 9, (this.hp / this.maxHp) * 38, 4);
    }
}
