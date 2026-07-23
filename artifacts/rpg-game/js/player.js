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
            this.animTimer += 0.15; // Velocidade da animação dos passos
        } else {
            this.isMoving = false;
            // Retorna a animação suavemente para a posição de descanso
            this.animTimer = 0; 
        }

        this.x += dx * currentSpeed;
        this.y += dy * currentSpeed;

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
        
        // --- Lógica de Animação Fluida ---
        // Balanço do corpo quase imperceptível (remove o aspecto de "pulo")
        let bodyBob = this.isMoving ? Math.abs(Math.sin(this.animTimer * 4)) * 1.5 : 0; 
        
        // Alternância das pernas para simular passos
        let leg1 = this.isMoving ? Math.sin(this.animTimer * 8) * 4 : 0; 
        let leg2 = this.isMoving ? Math.sin(this.animTimer * 8 + Math.PI) * 4 : 0; 
        
        // Balanço da capa para trás e balanço da arma
        let capeSway = this.isMoving ? Math.sin(this.animTimer * 5) * 3 : 0;
        let weaponSway = this.isMoving ? Math.sin(this.animTimer * 6) * 2 : 0;

        let renderY = this.y - bodyBob;

        // 1. Sombra Fixa (Não pula com o corpo, mantém a noção de profundidade)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.ellipse(this.x + 16, this.y + 32, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Capa Sombria Dinâmica (arrasta atrás do personagem)
        ctx.fillStyle = '#170e1f'; 
        if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 4 - capeSway/2, renderY + 8, 24, 22);
        } else if (this.direction === 'UP') {
            ctx.fillRect(this.x + 2 + capeSway, renderY + 10, 28, 24);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 14 + Math.abs(capeSway), renderY + 10, 16, 20);
        } else {
            ctx.fillRect(this.x + 2 - Math.abs(capeSway), renderY + 10, 16, 20);
        }

        // 3. Pernas (Simulação de caminhada)
        ctx.fillStyle = '#0a0a0d';
        if (this.direction === 'DOWN' || this.direction === 'UP') {
            ctx.fillRect(this.x + 10, this.y + 24 + leg1, 4, 8);
            ctx.fillRect(this.x + 18, this.y + 24 + leg2, 4, 8);
        } else if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 12 + leg1, this.y + 24, 4, 8);
            ctx.fillRect(this.x + 16 + leg2, this.y + 24, 4, 8);
        } else {
            ctx.fillRect(this.x + 16 + leg1, this.y + 24, 4, 8);
            ctx.fillRect(this.x + 12 + leg2, this.y + 24, 4, 8);
        }

        // 4. Torso / Armadura (Aço Escuro)
        ctx.fillStyle = '#2b2c3a';
        ctx.fillRect(this.x + 8, renderY + 12, 16, 14);
        
        // Placas frontais da armadura
        if (this.direction !== 'UP') {
            ctx.fillStyle = '#1e1f29';
            ctx.fillRect(this.x + 10, renderY + 14, 12, 3);
            ctx.fillRect(this.x + 10, renderY + 19, 12, 3);
        }

        // 5. Gema de Poder Central (Brilhante)
        if (this.direction === 'DOWN') {
            ctx.fillStyle = '#ff003c';
            ctx.shadowColor = '#ff003c';
            ctx.shadowBlur = 6;
            ctx.fillRect(this.x + 14, renderY + 15, 4, 4);
            ctx.shadowBlur = 0;
        }

        // 6. Ombreiras Espetadas
        ctx.fillStyle = '#414354';
        ctx.beginPath();
        ctx.moveTo(this.x + 4, renderY + 14);
        ctx.lineTo(this.x + 8, renderY + 10);
        ctx.lineTo(this.x + 12, renderY + 14);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + 20, renderY + 14);
        ctx.lineTo(this.x + 24, renderY + 10);
        ctx.lineTo(this.x + 28, renderY + 14);
        ctx.fill();

        // 7. Cabeça e Elmo
        ctx.fillStyle = '#1c1d26';
        ctx.fillRect(this.x + 8, renderY + 2, 16, 12);
        
        // Chifres do Elmo
        ctx.fillStyle = '#111217';
        if (this.direction === 'DOWN' || this.direction === 'UP') {
            ctx.fillRect(this.x + 4, renderY - 2, 4, 8);
            ctx.fillRect(this.x + 24, renderY - 2, 4, 8);
        } else if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 18, renderY - 2, 4, 6);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 10, renderY - 2, 4, 6);
        }

        // 8. Visor Brilhante (Substitui os olhos separados)
        if (this.direction !== 'UP') {
            ctx.fillStyle = '#ff003c';
            ctx.shadowColor = '#ff003c';
            ctx.shadowBlur = 10;
            if (this.direction === 'DOWN') {
                ctx.fillRect(this.x + 11, renderY + 6, 10, 2); 
            } else if (this.direction === 'RIGHT') {
                ctx.fillRect(this.x + 18, renderY + 6, 6, 2);
            } else if (this.direction === 'LEFT') {
                ctx.fillRect(this.x + 8, renderY + 6, 6, 2);
            }
            ctx.shadowBlur = 0;
        }

        // 9. Arma Gigante (Espadão) com Animação de Balanço
        ctx.fillStyle = '#7a7d8c'; // Lâmina
        if (this.direction === 'RIGHT') {
            ctx.fillRect(this.x + 24, renderY + 8 + weaponSway, 6, 18);
            ctx.fillStyle = '#3a2015'; // Guarda/Cabo
            ctx.fillRect(this.x + 22, renderY + 14 + weaponSway, 10, 3);
        } else if (this.direction === 'LEFT') {
            ctx.fillRect(this.x + 2, renderY + 8 - weaponSway, 6, 18);
            ctx.fillStyle = '#3a2015';
            ctx.fillRect(this.x, renderY + 14 - weaponSway, 10, 3);
        } else if (this.direction === 'DOWN') {
            ctx.fillRect(this.x + 26, renderY + 10 + weaponSway, 4, 16);
            ctx.fillStyle = '#3a2015';
            ctx.fillRect(this.x + 24, renderY + 14 + weaponSway, 8, 3);
        } else {
            ctx.fillRect(this.x + 2, renderY + 10 + weaponSway, 4, 16);
        }

        // 10. Barra de Vida
        ctx.fillStyle = 'rgba(10, 5, 15, 0.9)';
        ctx.fillRect(this.x - 4, this.y - 14, 40, 5);
        ctx.fillStyle = '#ff003c';
        ctx.fillRect(this.x - 3, this.y - 13, (this.hp / this.maxHp) * 38, 3);

        ctx.restore();
    }
}
