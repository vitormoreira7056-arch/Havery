import { RACES } from './races.js';

export class Player {
    constructor(x, y, raceKey = 'HUMANO') {
        this.x = x;
        this.y = y;
        this.width = 64; 
        this.height = 64;
        this.speed = 3.5;
        
        this.race = RACES[raceKey] || RACES.HUMANO;
        this.hp = this.race.bonus.hp;
        this.maxHp = this.race.bonus.hp;
        
        this.direction = 'DOWN';
        this.isMoving = false;
        
        // Temporizadores para física e animação
        this.animTimer = 0;
        this.breathTimer = 0;
        this.capeInertia = 0;
        
        // Sistema de partículas para passos
        this.particles = [];
    }

    move(dx, dy, mapWidth, mapHeight) {
        const currentSpeed = this.speed * this.race.bonus.speed;
        
        this.breathTimer += 0.05; // Respiração constante

        if (dx !== 0 || dy !== 0) {
            this.isMoving = true;
            this.animTimer += 0.15;
            
            // Inércia da capa (atraso ao virar)
            let targetInertia = dx * 10;
            this.capeInertia += (targetInertia - this.capeInertia) * 0.1;

            // Gerador de partículas (poeira ao pisar)
            if (Math.abs(Math.sin(this.animTimer * 1.5)) > 0.9 && Math.random() > 0.5) {
                this.particles.push({
                    x: this.x + this.width / 2 + (Math.random() * 10 - 5),
                    y: this.y + this.height - 5,
                    vx: -dx * 0.5 + (Math.random() * 0.5 - 0.25),
                    vy: -dy * 0.5 - (Math.random() * 0.5),
                    life: 1,
                    size: Math.random() * 3 + 1
                });
            }
        } else {
            this.isMoving = false;
            this.animTimer += (0 - this.animTimer) * 0.1; 
            this.capeInertia += (0 - this.capeInertia) * 0.1;
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

        // Atualiza partículas
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            p.size += 0.1;
        });
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw(ctx) {
        ctx.save();

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // --- Cálculo de Cinemática e Orgânica ---
        let walkCycle = this.isMoving ? Math.sin(this.animTimer * 1.5) : 0;
        let walkCycleCos = this.isMoving ? Math.cos(this.animTimer * 1.5) : 1;
        
        let legSwing = walkCycle * 18; // Ângulo das pernas
        let armSwing = -walkCycle * 22; // Ângulo dos braços
        
        // Elevação do corpo ao caminhar (Bobbing parabólico) e Respiração
        let bodyBob = this.isMoving ? Math.abs(walkCycleCos) * 4 : 0;
        let breathing = Math.sin(this.breathTimer) * 1.5;
        let renderY = centerY - bodyBob - breathing;

        // --- Renderização do Sistema de Partículas ---
        this.particles.forEach(p => {
            ctx.fillStyle = `rgba(150, 130, 110, ${p.life * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // --- 1. Sombreamento Volumétrico de Oclusão ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.filter = 'blur(3px)';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 28, 22 - bodyBob/2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = 'none';

        // --- Utilitários de Materiais e Gradientes ---
        const createVolumetricMat = (x, y, r, colorStart, colorEnd) => {
            let grad = ctx.createRadialGradient(x - r/3, y - r/3, r/8, x, y, r);
            grad.addColorStop(0, colorStart);
            grad.addColorStop(1, colorEnd);
            return grad;
        };

        const matLeather = createVolumetricMat(centerX, renderY, 20, '#8b5a2b', '#2c1c0e');
        const matDarkLeather = createVolumetricMat(centerX, renderY + 15, 15, '#4a3018', '#150d06');
        const matSkin = createVolumetricMat(centerX, renderY - 18, 12, '#ffe0bd', '#c58c61');
        const matSteel = ctx.createLinearGradient(centerX - 10, renderY - 30, centerX + 10, renderY + 30);
        matSteel.addColorStop(0, '#ffffff');
        matSteel.addColorStop(0.3, '#a0b0c0');
        matSteel.addColorStop(1, '#3a4a5a');

        // Função de Cinemática para Membros Articulados (Dobra do Joelho/Cotovelo)
        const drawArticulatedLimb = (startX, startY, length, angle, isArm, isRightSide) => {
            ctx.save();
            ctx.translate(startX, startY);
            ctx.rotate(angle * Math.PI / 180);
            
            // Dobra procedural dependendo se está movendo para frente ou trás
            let jointBend = isArm ? (angle < 0 ? angle * 0.5 : 0) : (angle > 0 ? angle * 0.8 : 0);
            if (!isArm && this.direction === 'UP') jointBend = -jointBend; // Inverte joelho de costas
            
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Parte Superior (Coxa / Braço)
            ctx.lineWidth = isArm ? 7 : 9;
            ctx.strokeStyle = matDarkLeather;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, length * 0.5);
            ctx.stroke();

            // Parte Inferior (Canela / Antebraço) articulada
            ctx.translate(0, length * 0.5);
            ctx.rotate(jointBend * Math.PI / 180);
            
            ctx.lineWidth = isArm ? 6 : 8;
            ctx.strokeStyle = isArm ? matSkin : '#1a110a'; // Mão nua ou Bota escura
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, length * 0.5);
            ctx.stroke();

            // Detalhe: Braçadeira ou Borda da Bota
            ctx.fillStyle = '#111';
            ctx.fillRect(-ctx.lineWidth/2, -2, ctx.lineWidth, 4);
            
            ctx.restore();
        };

        // --- Renderização Dinâmica e Ordenação Z ---

        // CAPA / CACHECOL (Fundo - Física de inércia)
        if (this.direction !== 'DOWN') {
            ctx.fillStyle = '#4a0e0e';
            ctx.beginPath();
            if (this.direction === 'UP') {
                ctx.moveTo(centerX - 14, renderY - 8);
                ctx.bezierCurveTo(centerX - 25 - this.capeInertia, renderY + 15, centerX - 10, renderY + 25, centerX - 12 + this.capeInertia, renderY + 32);
                ctx.lineTo(centerX + 12 + this.capeInertia, renderY + 32);
                ctx.bezierCurveTo(centerX + 10, renderY + 25, centerX + 25 - this.capeInertia, renderY + 15, centerX + 14, renderY - 8);
            }
            ctx.fill();
        }

        // PERNAS
        if (this.direction === 'DOWN' || this.direction === 'UP') {
            drawArticulatedLimb(centerX - 7, renderY + 8, 22, legSwing, false, false);
            drawArticulatedLimb(centerX + 7, renderY + 8, 22, -legSwing, false, true);
        } else if (this.direction === 'RIGHT') {
            drawArticulatedLimb(centerX - 2, renderY + 8, 22, legSwing, false, false);
            drawArticulatedLimb(centerX + 4, renderY + 8, 22, -legSwing, false, true);
        } else if (this.direction === 'LEFT') {
            drawArticulatedLimb(centerX + 2, renderY + 8, 22, -legSwing, false, true);
            drawArticulatedLimb(centerX - 4, renderY + 8, 22, legSwing, false, false);
        }

        // TORSO (Modelagem Volumétrica)
        ctx.fillStyle = matLeather;
        ctx.beginPath();
        if (this.direction === 'DOWN' || this.direction === 'UP') {
            // Corpo se expande levemente com a respiração
            ctx.ellipse(centerX, renderY, 13 + breathing/3, 15, 0, 0, Math.PI * 2);
        } else {
            ctx.ellipse(centerX, renderY, 9 + breathing/3, 15, 0, 0, Math.PI * 2);
        }
        ctx.fill();

        // DETALHES DO TRONCO (Costuras, Cinto, Bainha)
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (this.direction === 'DOWN') {
            ctx.moveTo(centerX, renderY - 14); ctx.lineTo(centerX, renderY + 10); // Zíper/Costura
            ctx.stroke();
        }

        // Cinto tático com volume
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.ellipse(centerX, renderY + 10, this.direction === 'DOWN' || this.direction === 'UP' ? 14 : 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        if (this.direction === 'DOWN' || this.direction === 'RIGHT') {
            // Fivela Dourada com brilho
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(this.direction === 'DOWN' ? centerX - 4 : centerX + 4, renderY + 8, 8, 5);
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.direction === 'DOWN' ? centerX - 2 : centerX + 5, renderY + 8, 2, 2); // Reflexo
        }

        // SISTEMA DE BRAÇOS E ESPADA
        const drawArmAndSword = (startX, startY, angle, isSwordArm, isRightSide) => {
            drawArticulatedLimb(startX, startY, 18, angle, true, isRightSide);
            
            if (isSwordArm) {
                ctx.save();
                // Calcula a ponta da mão baseada na cinemática do braço
                let jointBend = angle < 0 ? angle * 0.5 : 0;
                let elbowX = startX + Math.sin(angle * Math.PI/180) * 9;
                let elbowY = startY + Math.cos(angle * Math.PI/180) * 9;
                let handAngle = angle + jointBend;
                let handX = elbowX + Math.sin(handAngle * Math.PI/180) * 9;
                let handY = elbowY + Math.cos(handAngle * Math.PI/180) * 9;
                
                ctx.translate(handX, handY);

                // Fluidez e peso da espada
                let swordRotation = 0;
                if (this.direction === 'RIGHT') swordRotation = 55 + angle * 0.5;
                if (this.direction === 'LEFT') swordRotation = -55 + angle * 0.5;
                if (this.direction === 'DOWN') swordRotation = 80 + angle * 0.8;
                if (this.direction === 'UP') swordRotation = -80 + angle * 0.8;
                
                ctx.rotate(swordRotation * Math.PI/180);

                // Renderização AAA da Espada (Geometria Complexa)
                // 1. Lâmina principal
                ctx.fillStyle = matSteel;
                ctx.beginPath();
                ctx.moveTo(-4, 0);
                ctx.lineTo(-3, -35); // Base fina
                ctx.lineTo(0, -42);  // Ponta super afiada
                ctx.lineTo(3, -35);
                ctx.lineTo(4, 0);
                ctx.fill();
                
                // 2. Fio da lâmina (Corte chanfrado)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.beginPath();
                ctx.moveTo(0, 0); ctx.lineTo(0, -42); ctx.lineTo(3, -35); ctx.lineTo(4, 0);
                ctx.fill();

                // 3. Sulco central (Fuller)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(-1, -34, 2, 30);

                // 4. Guarda detalhada (Crossguard)
                let guardGrad = ctx.createLinearGradient(-10, 0, 10, 0);
                guardGrad.addColorStop(0, '#5a421b'); guardGrad.addColorStop(0.5, '#d4af37'); guardGrad.addColorStop(1, '#5a421b');
                ctx.fillStyle = guardGrad;
                ctx.beginPath();
                ctx.moveTo(-10, -2); ctx.lineTo(10, -2); ctx.lineTo(12, 2); ctx.lineTo(-12, 2);
                ctx.fill();

                // 5. Cabo enrolado em couro
                ctx.fillStyle = '#2c1c0e';
                ctx.fillRect(-2, 2, 4, 8);
                ctx.strokeStyle = '#4a3018';
                ctx.lineWidth = 1;
                for(let i=3; i<10; i+=2) {
                    ctx.beginPath(); ctx.moveTo(-2, i); ctx.lineTo(2, i+1); ctx.stroke();
                }

                // 6. Pomo com gema
                ctx.fillStyle = '#d4af37';
                ctx.beginPath(); ctx.arc(0, 11, 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ff3366'; // Gema mágica rubi
                ctx.beginPath(); ctx.arc(0, 11, 1.5, 0, Math.PI * 2); ctx.fill();

                ctx.restore();
            }
        };

        // ORDENAÇÃO Z-INDEX DOS BRAÇOS
        if (this.direction === 'DOWN') {
            drawArmAndSword(centerX - 13, renderY - 8, armSwing, false, false);
            drawArmAndSword(centerX + 13, renderY - 8, -armSwing, true, true);
        } else if (this.direction === 'UP') {
            drawArmAndSword(centerX + 13, renderY - 8, -armSwing, true, true);
            drawArmAndSword(centerX - 13, renderY - 8, armSwing, false, false);
        } else if (this.direction === 'RIGHT') {
            drawArmAndSword(centerX - 4, renderY - 8, armSwing, false, false); // Trás
            drawArmAndSword(centerX + 6, renderY - 8, -armSwing, true, true); // Frente
        } else if (this.direction === 'LEFT') {
            drawArmAndSword(centerX + 4, renderY - 8, -armSwing, true, true); // Trás
            drawArmAndSword(centerX - 6, renderY - 8, armSwing, false, false); // Frente
        }

        // CABEÇA (Formato orgânico)
        ctx.fillStyle = matSkin;
        ctx.beginPath();
        let headY = renderY - 22;
        ctx.ellipse(centerX, headY, 11, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        // DETALHES DO ROSTO
        if (this.direction !== 'UP') {
            ctx.fillStyle = 'rgba(0,0,0,0.2)'; // Sombras dos olhos (Ambient Occlusion)
            ctx.beginPath();
            if (this.direction === 'DOWN') {
                ctx.arc(centerX - 4, headY - 1, 3, 0, Math.PI * 2);
                ctx.arc(centerX + 4, headY - 1, 3, 0, Math.PI * 2);
            } else if (this.direction === 'RIGHT') {
                ctx.arc(centerX + 6, headY - 1, 3, 0, Math.PI * 2);
            } else if (this.direction === 'LEFT') {
                ctx.arc(centerX - 6, headY - 1, 3, 0, Math.PI * 2);
            }
            ctx.fill();
            
            // Olhos reflexivos
            ctx.fillStyle = '#fff';
            if (this.direction === 'DOWN') {
                ctx.fillRect(centerX - 5, headY - 2, 2, 2);
                ctx.fillRect(centerX + 3, headY - 2, 2, 2);
            } else if (this.direction === 'RIGHT') {
                ctx.fillRect(centerX + 5, headY - 2, 2, 2);
            } else if (this.direction === 'LEFT') {
                ctx.fillRect(centerX - 7, headY - 2, 2, 2);
            }
        }

        // CABELO (Física suave e mechas volumétricas)
        let hairGrad = ctx.createLinearGradient(centerX, headY - 15, centerX, headY);
        hairGrad.addColorStop(0, '#3a2010');
        hairGrad.addColorStop(1, '#150a05');
        ctx.fillStyle = hairGrad;
        
        ctx.beginPath();
        if (this.direction === 'DOWN') {
            // Volume no topo
            ctx.arc(centerX, headY - 2, 12, Math.PI, 0); 
            // Franja desfiada
            ctx.bezierCurveTo(centerX + 12, headY + 5, centerX + 5, headY - 8, centerX, headY - 5);
            ctx.bezierCurveTo(centerX - 5, headY - 8, centerX - 12, headY + 5, centerX - 12, headY - 2);
        } else if (this.direction === 'UP') {
            ctx.arc(centerX, headY, 12.5, 0, Math.PI * 2);
        } else if (this.direction === 'RIGHT') {
            ctx.arc(centerX, headY - 2, 12, Math.PI * 0.8, Math.PI * 2.2);
            // Mecha solta balançando nas costas
            ctx.bezierCurveTo(centerX - 8, headY + 10 - walkCycle*2, centerX - 12, headY + 5, Math.cos(Math.PI * 0.8)*12 + centerX, Math.sin(Math.PI * 0.8)*12 + headY - 2);
        } else if (this.direction === 'LEFT') {
            ctx.arc(centerX, headY - 2, 12, Math.PI * 1.2, Math.PI * 0.2, true);
            // Mecha solta
            ctx.bezierCurveTo(centerX + 8, headY + 10 - walkCycle*2, centerX + 12, headY + 5, Math.cos(Math.PI * 0.2)*12 + centerX, Math.sin(Math.PI * 0.2)*12 + headY - 2);
        }
        ctx.fill();

        ctx.restore();

        // --- HUD Moderno e Minimista (UI AAA) ---
        // Fundo escuro esfumaçado para leitura perfeita
        ctx.fillStyle = 'rgba(10, 10, 12, 0.7)';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.roundRect(this.x + 4, this.y - 12, 56, 8, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Gradiente da Vida (Verde Esmeralda Brilhante)
        let hpGrad = ctx.createLinearGradient(this.x, 0, this.x + 56, 0);
        hpGrad.addColorStop(0, '#00b894');
        hpGrad.addColorStop(1, '#55efc4');
        ctx.fillStyle = hpGrad;
        
        ctx.beginPath();
        let currentHpWidth = (this.hp / this.maxHp) * 52;
        if (currentHpWidth > 0) {
            ctx.roundRect(this.x + 6, this.y - 10, currentHpWidth, 4, 2);
            ctx.fill();
        }
        
        // Brilho superior na barra (Glossy effect)
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.roundRect(this.x + 6, this.y - 10, currentHpWidth, 1.5, 1);
        ctx.fill();
    }
}
