export const ELEMENTS = {
    AGUA: { id: "AGUA", name: "Água", strongAgainst: ["FOGO", "CAOS"], weakAgainst: ["RAIO", "GRAMA"] },
    TERRA: { id: "TERRA", name: "Terra", strongAgainst: ["RAIO", "FOGO"], weakAgainst: ["GELO", "AR"] },
    FOGO: { id: "FOGO", name: "Fogo", strongAgainst: ["GRAMA", "GELO"], weakAgainst: ["AGUA", "TERRA"] },
    AR: { id: "AR", name: "Ar", strongAgainst: ["TERRA", "VENENO"], weakAgainst: ["GELO", "RAIO"] },
    GELO: { id: "GELO", name: "Gelo", strongAgainst: ["AR", "TERRA"], weakAgainst: ["FOGO", "CAOS"] },
    GRAMA: { id: "GRAMA", name: "Grama", strongAgainst: ["AGUA", "RAIO"], weakAgainst: ["FOGO", "VENENO"] },
    RAIO: { id: "RAIO", name: "Raio", strongAgainst: ["AGUA", "AR"], weakAgainst: ["TERRA", "GRAMA"] },
    VENENO: { id: "VENENO", name: "Veneno", strongAgainst: ["GRAMA", "SAGRADO"], weakAgainst: ["AR", "PSIQUICO"] },
    SAGRADO: { id: "SAGRADO", name: "Sagrado", strongAgainst: ["ESCURIDAO", "DEMONIO"], weakAgainst: ["VENENO", "PSIQUICO"] },
    ESCURIDAO: { id: "ESCURIDAO", name: "Escuridão", strongAgainst: ["LUZ", "PSIQUICO"], weakAgainst: ["SAGRADO", "MORTE"] },
    DEMONIO: { id: "DEMONIO", name: "Demônio", strongAgainst: ["LUZ", "ESPIRITO"], weakAgainst: ["SAGRADO", "MORTE"] },
    LUZ: { id: "LUZ", name: "Luz", strongAgainst: ["CAOS", "MORTE"], weakAgainst: ["ESCURIDAO", "DEMONIO"] },
    MORTE: { id: "MORTE", name: "Morte", strongAgainst: ["ESCURIDAO", "DEMONIO"], weakAgainst: ["LUZ", "ESPIRITO"] },
    ESPIRITO: { id: "ESPIRITO", name: "Espírito", strongAgainst: ["MORTE", "PSIQUICO"], weakAgainst: ["DEMONIO", "CAOS"] },
    PSIQUICO: { id: "PSIQUICO", name: "Psíquico", strongAgainst: ["VENENO", "SAGRADO"], weakAgainst: ["ESCURIDAO", "ESPIRITO"] },
    CAOS: { id: "CAOS", name: "Caos", strongAgainst: ["GELO", "ESPIRITO"], weakAgainst: ["AGUA", "LUZ"] }
};

// Gera o template zerado de resistências e proficiências elementais para novas entidades
export const generateElementalTemplate = () => {
    let template = { resistance: {}, proficiency: {} };
    for (const key in ELEMENTS) {
        template.resistance[key] = 0; // % de Resistência
        template.proficiency[key] = 0; // % de Proficiência (Dano extra)
    }
    return template;
};
