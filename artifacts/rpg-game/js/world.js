export class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        // Fundo base escuro da cidade gótica expandida
        ctx.fillStyle = '#120d18';
        ctx.fillRect(0, 0, this.width, this.height);

        // Grid de pisos / pedras arruinadas
        ctx.strokeStyle = '#1d1526';
        ctx.lineWidth = 1;
        const tileSize = 60;
        
        for (let x = 0; x < this.width; x += tileSize) {
            for (let y = 0; y < this.height; y += tileSize) {
                ctx.strokeRect(x, y, tileSize, tileSize);
                
                if ((x + y) % 180 === 0) {
                    ctx.fillStyle = '#171021';
                    ctx.fillRect(x + 10, y + 10, tileSize - 20, tileSize - 20);
                }
            }
        }

        // Praça Central Dark Fantasy
        ctx.fillStyle = '#1a1124';
        ctx.fillRect(900, 700, 600, 400);
        ctx.strokeStyle = '#2d1f3d';
        ctx.lineWidth = 3;
        ctx.strokeRect(900, 700, 600, 400);

        // Fonte mística no centro da praça
        ctx.fillStyle = '#0f0a14';
        ctx.beginPath();
        ctx.arc(1200, 900, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a2e6b';
        ctx.stroke();

        ctx.fillStyle = '#211630';
        ctx.fillRect(1160, 860, 80, 80);

        // Muros perimetrais e torres de vigia góticas
        ctx.fillStyle = '#1f142b';
        ctx.fillRect(0, 0, this.width, 80); // Norte
        ctx.fillRect(0, this.height - 80, this.width, 80); // Sul
        ctx.fillRect(0, 0, 80, this.height); // Oeste
        ctx.fillRect(this.width - 80, 0, 80, this.height); // Leste

        // Torres e estruturas de reforço nos muros
        ctx.fillStyle = '#0d0812';
        for (let x = 300; x < this.width - 300; x += 600) {
            ctx.fillRect(x, 10, 120, 60);
            ctx.fillRect(x, this.height - 70, 120, 60);
        }
    }
}
