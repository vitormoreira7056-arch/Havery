export class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        // Fundo base: Chão de paralelepípedos escuros da cidade gótica
        ctx.fillStyle = '#181220';
        ctx.fillRect(0, 0, this.width, this.height);

        // Textura simples de pisos / lajes arruinadas
        ctx.strokeStyle = '#231930';
        ctx.lineWidth = 1;
        const tileSize = 40;
        
        for (let x = 0; x < this.width; x += tileSize) {
            for (let y = 0; y < this.height; y += tileSize) {
                ctx.strokeRect(x, y, tileSize, tileSize);
            }
        }

        // Elementos decorativos da cidade Dark Fantasy (Ruínas / Muros de pedra antigos)
        ctx.fillStyle = '#281c37';
        // Muro superior esquerdo
        ctx.fillRect(0, 0, 300, 60);
        // Muro superior direito
        ctx.fillRect(500, 0, 300, 60);

        // Detalhes góticos nos muros (fendas / janelas falsas)
        ctx.fillStyle = '#100a14';
        ctx.fillRect(100, 20, 40, 40);
        ctx.fillRect(660, 20, 40, 40);

        // Portal / Tochas apagadas nas laterais
        ctx.fillStyle = '#3a2548';
        ctx.fillRect(380, 0, 40, 20);
    }
}
