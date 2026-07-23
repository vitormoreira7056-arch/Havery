import { ATTRIBUTES_TEMPLATE } from './attributes.js';
import { generateElementalTemplate, ELEMENTS } from './elements.js';

export class Entity {
    constructor(name, initialStats = {}) {
        this.name = name;
        
        // Clona os templates zerados para evitar mutação indesejada no objeto base
        this.stats = { ...ATTRIBUTES_TEMPLATE };
        this.elements = generateElementalTemplate();
        
        // Aplica os atributos iniciais passados por parâmetro (Raça, Inimigo, Equipamentos)
        this.applyStats(initialStats);
        
        // Vida e Mana atuais começam no máximo
        this.currentHp = this.stats.HP;
        this.currentMp = this.stats.MP;
        
        // Estados temporários da batalha
        this.isDefending = false;
    }

    // Função modular para somar atributos (útil quando equipar itens)
    applyStats(newStats) {
        for (const stat in newStats) {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] += newStats[stat];
            }
        }
    }

    takePhysicalDamage(rawDamage) {
        // Cálculo com Defesa Física e Penetração
        const effectiveDefense = this.isDefending ? this.stats.DF * 2 : this.stats.DF;
        let actualDamage = rawDamage - effectiveDefense;
        
        if (actualDamage < 1) actualDamage = 1;

        this.currentHp -= actualDamage;
        if (this.currentHp < 0) this.currentHp = 0;

        return actualDamage;
    }

    // Preparado para magias e ataques elementais no futuro
    takeElementalDamage(rawDamage, elementKey) {
        let resistance = this.elements.resistance[elementKey] || 0;
        let mitigatedDamage = rawDamage * (1 - (resistance / 100));
        
        if (mitigatedDamage < 1) mitigatedDamage = 1;
        
        this.currentHp -= mitigatedDamage;
        if (this.currentHp < 0) this.currentHp = 0;
        
        return Math.floor(mitigatedDamage);
    }

    heal(amount) {
        this.currentHp += amount;
        if (this.currentHp > this.stats.HP) this.currentHp = this.stats.HP;
    }
    
    restoreMana(amount) {
        this.currentMp += amount;
        if (this.currentMp > this.stats.MP) this.currentMp = this.stats.MP;
    }
}
