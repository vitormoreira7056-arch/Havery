export class Entity {
    constructor(name, stats) {
        this.name = name;
        this.maxHp = stats.hp;
        this.hp = stats.hp;
        this.attack = stats.attack;
        this.defense = stats.defense;
        
        // Estado temporário aplicado durante o turno
        this.isDefending = false;
    }

    takeDamage(rawDamage) {
        // Se estiver defendendo, a defesa dobra naquele turno
        const currentDefense = this.isDefending ? this.defense * 2 : this.defense;
        
        // Cálculo básico de dano (dano bruto - defesa)
        let actualDamage = rawDamage - currentDefense;
        
        // Garante que o dano mínimo sempre seja 1 (exceto se errar, mecânica futura)
        if (actualDamage < 1) actualDamage = 1;

        this.hp -= actualDamage;
        if (this.hp < 0) this.hp = 0;

        return actualDamage;
    }

    heal(amount) {
        this.hp += amount;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
    }
}
