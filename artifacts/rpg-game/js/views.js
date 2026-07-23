export const viewsHTML = `
<main id="main-content">
    <!-- TELA: MUNDO -->
    <div id="view-mundo" class="view-section active">
        <div class="placeholder-content">
            <div class="banner-cidade">
                <h3>Bem-vindo ao Mundo</h3>
                <p>Selecione uma ação abaixo ou explore os menus.</p>
            </div>
        </div>
    </div>

    <!-- TELA: MAPA (Novo Sistema Gigante com Zoom Dinâmico) -->
    <div id="view-mapa" class="view-section hidden">
        <div class="map-header">
            <h2>🗺️ Mapa do Mundo — Dreht</h2>
        </div>
        
        <div class="map-viewport" id="map-viewport">
            
            <!-- Controles Virtuais de Zoom -->
            <div class="map-controls">
                <button class="map-btn" id="btn-zoom-in">+</button>
                <button class="map-btn" id="btn-zoom-out">-</button>
            </div>

            <!-- Div que calcula o tamanho físico pro scroll não quebrar -->
            <div class="map-scale-wrapper" id="map-scale-wrapper">
                <!-- O Mapa Bruto que recebe a transformação de escala -->
                <div class="map-world" id="map-world">
                    <!-- Nodos gerados dinamicamente via JS -->
                </div>
            </div>

        </div>

        <!-- Painel Inferior do Mapa -->
        <div class="map-details-panel">
            <div class="details-empty" id="map-empty-state">
                <span class="pin-icon">📍</span>
                Clique em uma localização no mapa para ver os detalhes.
            </div>
            
            <div class="details-content" id="map-details-state">
                <h3 class="loc-title" id="loc-name">Nome da Cidade</h3>
                <p class="loc-desc" id="loc-desc">Descrição detalhada do local.</p>
                <div class="loc-status">📜 Pergaminho de Fraddo: disponível — pode viajar!</div>
                <button class="btn-travel" id="btn-viajar">VIAJAR</button>
            </div>
        </div>
    </div>

    <!-- TELA: TRABALHOS -->
    <div id="view-trabalhos" class="view-section hidden">
        <div class="view-header">
            <h2>⚒️ TRABALHO</h2>
        </div>
        <p class="work-desc">Trabalhe para ganhar moedas e experiência. Cada trabalho gasta energia e impede missões ativas durante o processo.</p>
        
        <div class="stamina-panel">
            <div class="stamina-label"><span class="st-icon">⚡</span> Energia</div>
            <div class="bar-track st-track-large"><div class="bar-fill st-fill" style="width: 100%;"></div></div>
            <div class="stamina-text">57/57</div>
        </div>

        <div class="mastery-info-box">
            <div class="mastery-star">⭐</div>
            <div class="mastery-text">
                <h4>Maestria de Trabalho ativa</h4>
                <p>Repita um trabalho para subir de nível e ganhar mais moedas e XP.</p>
            </div>
        </div>

        <div class="work-tabs">
            <button class="work-tab active" data-work-tab="para-voce">Para você (<span id="count-voce">0</span>)</button>
            <button class="work-tab" data-work-tab="proximos">Próximos (<span id="count-proximos">0</span>)</button>
            <button class="work-tab" data-work-tab="outros">Outros (0)</button>
        </div>

        <div class="work-list-container" id="work-list-container">
            <!-- Cards renderizados via JS -->
        </div>
    </div>

    <!-- TELA: MOCHILA -->
    <div id="view-mochila" class="view-section hidden">
        <div class="view-header"><h2>🎒 INVENTÁRIO</h2></div>
        <div class="inv-category">
            <div class="inv-header">
                <h3>Equipamentos <span id="count-equipamentos" class="slot-count">0/70</span></h3>
                <button class="expand-btn" data-type="equipamentos">+5 (Ouro)</button>
            </div>
            <div class="inv-filters">
                <button class="filter-btn active">Todos</button>
                <button class="filter-btn">Armas</button>
                <button class="filter-btn">Armaduras</button>
                <button class="filter-btn">Acessórios</button>
            </div>
            <div class="inv-grid" id="grid-equipamentos"></div>
        </div>
        <div class="inv-category">
            <div class="inv-header">
                <h3>Materiais e Recursos <span id="count-materiais" class="slot-count">0/50</span></h3>
                <button class="expand-btn" data-type="materiais">+5 (Ouro)</button>
            </div>
            <div class="inv-grid" id="grid-materiais"></div>
        </div>
        <div class="inv-category">
            <div class="inv-header">
                <h3>Itens de Missão <span id="count-missoes" class="slot-count">0/35</span></h3>
                <button class="expand-btn" data-type="missoes">+3 (Ouro)</button>
            </div>
            <div class="inv-grid" id="grid-missoes"></div>
        </div>
        <div class="inv-category">
            <div class="inv-header">
                <h3>Espaço Pet <span id="count-pets" class="slot-count">0/10</span></h3>
                <button class="expand-btn diamond-btn" data-type="pets">+5 (Diamante)</button>
            </div>
            <div class="inv-grid" id="grid-pets"></div>
        </div>
    </div>

    <!-- TELA: PERSONAGEM -->
    <div id="view-personagem" class="view-section hidden">
        <div class="view-header centered"><h2>⚔️ EQUIPAMENTOS</h2></div>
        <div class="paperdoll-container">
            <div class="equip-col">
                <div class="equip-slot"><span class="slot-bg">Brinco</span></div>
                <div class="equip-slot"><span class="slot-bg">Colar</span></div>
                <div class="equip-slot"><span class="slot-bg">Capa</span></div>
                <div class="equip-slot"><span class="slot-bg">Arma 1</span></div>
                <div class="equip-slot"><span class="slot-bg">Luvas</span></div>
                <div class="equip-slot"><span class="slot-bg">Anel 1</span></div>
                <div class="equip-slot"><span class="slot-bg">Anel 3</span></div>
            </div>
            <div class="equip-col center-col">
                <div class="equip-slot"><span class="slot-bg">Elmo</span></div>
                <div class="character-model">
                    <div class="mystic-glow"></div>
                    <img src="Humano.png" alt="Personagem" class="char-sprite-large">
                </div>
                <div class="equip-slot"><span class="slot-bg">Armadura</span></div>
                <div class="equip-slot"><span class="slot-bg">Calça</span></div>
                <div class="equip-slot"><span class="slot-bg">Pet 1</span></div>
                <div class="equip-slot"><span class="slot-bg">Pet 2</span></div>
            </div>
            <div class="equip-col">
                <div class="equip-slot"><span class="slot-bg">Brinco</span></div>
                <div class="equip-slot"><span class="slot-bg">Relíquia</span></div>
                <div class="equip-slot"><span class="slot-bg">Cinto</span></div>
                <div class="equip-slot"><span class="slot-bg">Arma 2</span></div>
                <div class="equip-slot"><span class="slot-bg">Botas</span></div>
                <div class="equip-slot"><span class="slot-bg">Anel 2</span></div>
                <div class="equip-slot"><span class="slot-bg">Anel 4</span></div>
            </div>
        </div>
        <div class="talismans-section">
            <div class="view-header centered"><h3>🔮 TALISMÃS</h3></div>
            <div class="talismans-grid" id="talismans-grid">
                <div class="equip-slot talisman locked" data-unlock="70"><span class="lock-icon">🔒</span><span class="slot-bg">NV 70</span></div>
                <div class="equip-slot talisman locked" data-unlock="140"><span class="lock-icon">🔒</span><span class="slot-bg">NV 140</span></div>
                <div class="equip-slot talisman locked" data-unlock="210"><span class="lock-icon">🔒</span><span class="slot-bg">NV 210</span></div>
                <div class="equip-slot talisman locked" data-unlock="280"><span class="lock-icon">🔒</span><span class="slot-bg">NV 280</span></div>
                <div class="equip-slot talisman locked" data-unlock="350"><span class="lock-icon">🔒</span><span class="slot-bg">NV 350</span></div>
            </div>
        </div>
    </div>
</main>
`;
