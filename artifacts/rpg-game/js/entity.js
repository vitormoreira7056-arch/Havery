import { ATTRIBUTES_TEMPLATE } from './attributes.js';
import { generateElementalTemplate, ELEMENTS } from './elements.js';

export class Entity {
    constructor(name, initialStats = {}) {
        this.name = name;
        
        // Atributos base e elementais
        this.stats = { ...ATTRIBUTES_TEMPLATE };
        this.elements = generateElementalTemplate();
        this.applyStats(initialStats);
        
        this.currentHp = this.stats.HP;
        this.currentMp = this.stats.MP;
        this.isDefending = false;

        // Sistema de Progressão
        this.level = 1;
        this.maxLevel = 999;
        this.xp = 0;
        this.xpRequired = this.calculateRequiredXp();
        this.talentPoints = 0;
        
        // Recompensa que esta entidade dá ao ser derrotada
        this.xpYield = 0;
    }

    applyStats(newStats) {
        for (const stat in newStats) {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] += newStats[stat];
            }
        }
    }

    // Curva Exponencial: Mais níveis = mais XP necessária para subir
    calculateRequiredXp() {
        return Math.floor(100 * Math.pow(this.level, 1.5));
    }

    gainXp(amount) {
        if (this.level >= this.maxLevel) return false;
        
        this.xp += amount;
        let leveledUp = false;

        // Suporta múltiplos níveis de uma vez caso ganhe muita XP
        while (this.xp >= this.xpRequired && this.level < this.maxLevel) {
            this.xp -= this.xpRequired;
            this.levelUp();
            leveledUp = true;
        }
        
        if (this.level >= this.maxLevel) {
            this.xp = 0;
            this.xpRequired = 0;
        }
        
        return leveledUp;
    }

    levelUp() {
        this.level++;
        this.talentPoints += 3;
        this.xpRequired = this.calculateRequiredXp();
        
        // Restaura a vida e mana ao passar de nível
        this.currentHp = this.stats.HP;
        this.currentMp = this.stats.MP;
    }

    takePhysicalDamage(rawDamage) {
        const effectiveDefense = this.isDefending ? this.stats.DF * 2 : this.stats.DF;
        let actualDamage = rawDamage - effectiveDefense;
        
        if (actualDamage < 1) actualDamage = 1;

        this.currentHp -= actualDamage;
        if (this.currentHp < 0) this.currentHp = 0;

        return actualDamage;
    }

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
