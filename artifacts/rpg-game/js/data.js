// Configurações do Inventário
export const INVENTORY_SETTINGS = {
    equipamentos: { current: 70, max: null, step: 5, cost: 100, curr: 'gold', items: [] },
    materiais: { current: 50, max: null, step: 5, cost: 50, curr: 'gold', items: [] },
    missoes: { current: 35, max: 50, step: 3, cost: 75, curr: 'gold', items: [] },
    pets: { current: 10, max: 30, step: 5, cost: 10, curr: 'diamond', items: [] }
};

// Dados dos Trabalhos
export const JOBS_DATA = [
    { id: 1, name: 'Ajudante de mercado', reqLevel: 1, stamina: 4, currType: 'copper', baseReward: 150, baseXP: 50, mastery: 1, maxMastery: 10 },
    { id: 2, name: 'Entregador de cartas', reqLevel: 5, stamina: 11, currType: 'copper', baseReward: 300, baseXP: 100, mastery: 2, maxMastery: 10 },
    { id: 3, name: 'Coletor de lenha', reqLevel: 10, stamina: 18, currType: 'copper', baseReward: 550, baseXP: 220, mastery: 1, maxMastery: 10 },
    { id: 4, name: 'Coletor de ervas', reqLevel: 20, stamina: 25, currType: 'copper', baseReward: 900, baseXP: 450, mastery: 1, maxMastery: 10 },
    { id: 5, name: 'Carregador de caixas', reqLevel: 30, stamina: 32, currType: 'copper', baseReward: 1400, baseXP: 750, mastery: 1, maxMastery: 10 },
    { id: 6, name: 'Pescador', reqLevel: 40, stamina: 39, currType: 'copper', baseReward: 2000, baseXP: 1100, mastery: 1, maxMastery: 10 },
    { id: 7, name: 'Vigia da floresta', reqLevel: 50, stamina: 46, currType: 'copper', baseReward: 2800, baseXP: 1600, mastery: 1, maxMastery: 10 },
    { id: 8, name: 'Vigia do portão', reqLevel: 65, stamina: 52, currType: 'copper', baseReward: 4000, baseXP: 2400, mastery: 1, maxMastery: 10 },
    { id: 9, name: 'Auxiliar na mina', reqLevel: 75, stamina: 59, currType: 'copper', baseReward: 5500, baseXP: 3500, mastery: 1, maxMastery: 10 },
    { id: 10, name: 'Mensageiro real', reqLevel: 90, stamina: 66, currType: 'bronze', baseReward: 800, baseXP: 5000, mastery: 1, maxMastery: 10 },
    { id: 11, name: 'Mercenário do rei', reqLevel: 120, stamina: 73, currType: 'bronze', baseReward: 1500, baseXP: 8000, mastery: 1, maxMastery: 10 },
    { id: 12, name: 'Emissário do rei', reqLevel: 150, stamina: 80, currType: 'bronze', baseReward: 3000, baseXP: 15000, mastery: 1, maxMastery: 10 }
];

export const TIME_MULTIPLIERS = [
    { label: '10m', mult: 1 },
    { label: '30m', mult: 3 },
    { label: '2h', mult: 12 },
    { label: '4h', mult: 25 },
    { label: '6h', mult: 40 }
];

// Localizações do Mapa (49 Nodos)
export const WORLD_LOCATIONS = [
    { id: 'erins', name: 'Erins', type: 'capital', x: 55, y: 35, desc: 'A capital central de Dreht.' },
    { id: 'erinia', name: 'Erinia', type: 'capital', x: 55, y: 64, desc: 'A grande cidade fortaleza do sul.' },
    { id: 'montanhas_gelidas', name: 'Montanhas Gélidas', type: 'perigo', x: 40, y: 10, desc: 'Picos hostis e congelados.' },
    { id: 'forte_nevlin', name: 'Forte Nevlin', type: 'fortaleza', x: 48, y: 15, desc: 'Bastião contra o avanço do inverno.' },
    { id: 'ninho_grifo', name: 'Ninho do Grifo', type: 'dungeon', x: 55, y: 12, desc: 'Abrigam feras lendárias em seus picos.' },
    { id: 'coroa_gelo', name: 'Coroa do Gelo', type: 'perigo', x: 53, y: 5, desc: 'O pico mais alto do mundo.' },
    { id: 'niflheim', name: 'Niflheim', type: 'dungeon', x: 92, y: 10, desc: 'O castelo congelado esquecido.' },
    { id: 'picos_flamejantes', name: 'Picos Flamejantes', type: 'perigo', x: 15, y: 10, desc: 'Vulcões em constante erupção.' },
    { id: 'fortaleza_kraag', name: 'Fortaleza de Kraag', type: 'fortaleza', x: 25, y: 15, desc: 'Base militar esculpida em pedra de magma.' },
    { id: 'minas_ferro', name: 'Minas de Ferro', type: 'dungeon', x: 14, y: 18, desc: 'A maior fonte de minerais de Dreht.' },
    { id: 'dorrene', name: 'Dorrene', type: 'cidade', x: 38, y: 22, desc: 'A joia do deserto comercial.' },
    { id: 'acampamento_nomades', name: 'Acampamento dos Nômades', type: 'cidade', x: 42, y: 30, desc: 'Comércio de relíquias exóticas.' },
    { id: 'planicies_khal', name: 'Planícies de Khal', type: 'cidade', x: 45, y: 26, desc: 'Vastos campos secos antes do deserto.' },
    { id: 'deserto_arak', name: 'Deserto de Arak', type: 'perigo', x: 18, y: 50, desc: 'Mar de areia escaldante e hostil.' },
    { id: 'necropole_antiga', name: 'Necrópole Antiga', type: 'dungeon', x: 35, y: 60, desc: 'Tumbas de um império esquecido.' },
    { id: 'oasis_perdido', name: 'Oásis Perdido', type: 'cidade', x: 25, y: 62, desc: 'Último porto seguro no mar de areia.' },
    { id: 'templo_deuses', name: 'Templo dos Deuses', type: 'dungeon', x: 15, y: 58, desc: 'Ruínas ancestrais adoradas por seitas.' },
    { id: 'joree', name: 'Joree', type: 'cidade', x: 65, y: 14, desc: 'Vila pacífica na borda da floresta.' },
    { id: 'bosque_anciaos', name: 'Bosque dos Anciãos', type: 'perigo', x: 75, y: 12, desc: 'Árvores tão antigas quanto o próprio mundo.' },
    { id: 'santuario_elfico', name: 'Santuário Élfico', type: 'cidade', x: 70, y: 18, desc: 'Local sagrado protegido por magia.' },
    { id: 'alfheim', name: 'Alfheim', type: 'capital', x: 82, y: 15, desc: 'A reclusa capital da alta-magia.' },
    { id: 'alena', name: 'Alena', type: 'cidade', x: 82, y: 32, desc: 'Cidade portuária e capital do comércio leste.' },
    { id: 'sutalisco', name: 'Sutalisco', type: 'cidade', x: 78, y: 48, desc: 'Polo mercante no delta do rio.' },
    { id: 'campos_sutilla', name: 'Campos de Sutilla', type: 'cidade', x: 72, y: 54, desc: 'Extensas fazendas que alimentam o continente.' },
    { id: 'floresta_thorn', name: 'Floresta de Thorn', type: 'perigo', x: 84, y: 58, desc: 'Denso bosque infestado de bestas selvagens.' },
    { id: 'colinas_douradas', name: 'Colinas Douradas', type: 'cidade', x: 35, y: 42, desc: 'Campos férteis abençoados pelo sol.' },
    { id: 'vilarejo_paz', name: 'Vilarejo da Paz', type: 'cidade', x: 38, y: 48, desc: 'Vila calma e próspera.' },
    { id: 'lago_prateado', name: 'Lago Prateado', type: 'cidade', x: 45, y: 50, desc: 'Águas místicas e cristalinas.' },
    { id: 'bareon', name: 'Bareon', type: 'cidade', x: 40, y: 56, desc: 'Posto avançado rodeado de perigos.' },
    { id: 'caverna_basilisco', name: 'Caverna do Basilisco', type: 'dungeon', x: 68, y: 58, desc: 'Masmorra tóxica incrustada na rocha.' },
    { id: 'coliseu_real', name: 'Coliseu Real', type: 'fortaleza', x: 62, y: 74, desc: 'Arena de combates sangrentos e glória.' },
    { id: 'pantano_lamentos', name: 'Pântano dos Lamentos', type: 'perigo', x: 45, y: 78, desc: 'Pântano sombrio e infestado de criaturas.' },
    { id: 'jungla_tazul', name: 'Jungla de Tazul', type: 'perigo', x: 35, y: 72, desc: 'A densa e chuvosa selva intocada.' },
    { id: 'ruinas_zarth', name: 'Ruínas de Zarth', type: 'dungeon', x: 20, y: 75, desc: 'Monumentos engolidos pela mata virgem.' },
    { id: 'zarvath', name: 'Zarvath', type: 'cidade', x: 55, y: 90, desc: 'Polo mercante do extremo sul.' },
    { id: 'costa_conchas', name: 'Costa das Conchas', type: 'cidade', x: 65, y: 92, desc: 'Praias tropicais famosas por suas pérolas.' },
    { id: 'fortaleza_sombras', name: 'Fortaleza das Sombras', type: 'dungeon', x: 82, y: 80, desc: 'Domínio corrompido por necromancia.' },
    { id: 'vale_almas', name: 'Vale das Almas', type: 'perigo', x: 78, y: 88, desc: 'Campos secos repletos de ecos do além.' },
    { id: 'portal_sombrio', name: 'Portal Sombrio', type: 'dungeon', x: 85, y: 92, desc: 'Fenda dimensional ligada ao submundo.' },
    { id: 'ilha_eco', name: 'Ilha do Eco', type: 'dungeon', x: 5, y: 32, desc: 'Ilha rodeada de brumas.' },
    { id: 'porto_salmar', name: 'Porto de Salmar', type: 'cidade', x: 18, y: 36, desc: 'Cidade dos lobos do mar e pescadores.' },
    { id: 'masmorra_tormenta', name: 'Masmorra da Tormenta', type: 'dungeon', x: 28, y: 26, desc: 'Forte isolado castigado pelos ventos.' },
    { id: 'posicao_abandonada', name: 'Posição Abandonada', type: 'dungeon', x: 95, y: 20, desc: 'Posto de vigia deixado para morrer.' },
    { id: 'enseada_aguias', name: 'Enseada das Águias', type: 'cidade', x: 85, y: 38, desc: 'Baía pacífica e próspera.' },
    { id: 'farol_velen', name: 'Farol de Velen', type: 'cidade', x: 95, y: 45, desc: 'A última luz para marinheiros no leste.' },
    { id: 'porto_estrela', name: 'Porto Estrela', type: 'cidade', x: 95, y: 58, desc: 'Polo mercante flutuante.' },
    { id: 'aqualon', name: 'Aqualon', type: 'capital', x: 92, y: 72, desc: 'A majestosa e luxuosa cidade insular.' },
    { id: 'refugio_piratas', name: 'Refúgio dos Piratas', type: 'cidade', x: 28, y: 88, desc: 'Paraíso de mercenários e escória dos mares.' },
    { id: 'ilha_tesouro', name: 'Ilha do Tesouro', type: 'dungeon', x: 8, y: 90, desc: 'Rumores dizem que fortunas estão enterradas aqui.' }
];
