export const headerHTML = `
<header id="top-header">
    <div class="header-top-row">
        <div class="profile-section" id="btn-profile">
            <div class="avatar-wrapper">
                <div class="avatar-border border-gold">
                    <img src="Humano.png" alt="Avatar" class="avatar-img">
                </div>
                <div class="level-badge" id="ui-level">10</div>
            </div>
        </div>

        <div class="player-status-section">
            <div class="player-info-row">
                <div class="player-identity">
                    <h2 id="player-name">Tracer</h2>
                    <span id="player-class">Guerreiro Místico</span>
                </div>
                <div class="top-actions">
                    <button id="btn-buffs" class="gold-btn">
                        <span>✨ Buffs</span> <div class="buff-count">3</div>
                    </button>
                    <button id="btn-menu" class="gold-btn outline">
                        <span>≡ Menu</span>
                    </button>
                </div>
            </div>

            <div id="dropdown-menu" class="hidden">
                <ul>
                    <li>💎 Loja Premium</li>
                    <li>✉️ Mensagens</li>
                    <li>📖 Guia do Jogo</li>
                    <li>🛠️ Suporte</li>
                    <li>⚙️ Configurações</li>
                    <li class="exit-btn">🚪 Sair</li>
                </ul>
            </div>

            <div class="status-bars">
                <div class="bar-container">
                    <div class="bar-icon hp-icon">❤</div>
                    <div class="bar-track"><div class="bar-fill hp-fill" style="width: 100%;"></div></div>
                    <div class="bar-value">141/141</div>
                </div>
                <div class="bar-container">
                    <div class="bar-icon mp-icon">💧</div>
                    <div class="bar-track"><div class="bar-fill mp-fill" style="width: 80%;"></div></div>
                    <div class="bar-value">68/85</div>
                </div>
                <div class="bar-container">
                    <div class="bar-icon st-icon">⚡</div>
                    <div class="bar-track"><div class="bar-fill st-fill" style="width: 100%;"></div></div>
                    <div class="bar-value">57/57</div>
                </div>
                <div class="bar-container">
                    <div class="bar-icon xp-icon">✨</div>
                    <div class="bar-track"><div class="bar-fill xp-fill" style="width: 71.3%;"></div></div>
                    <div class="bar-value xp-value">71.33%</div>
                </div>
            </div>
        </div>
    </div>

    <div class="currencies-row">
        <div class="currency"><span class="curr-icon copper">🟤</span> 12.4K</div>
        <div class="currency"><span class="curr-icon bronze">🟠</span> 4.1K</div>
        <div class="currency"><span class="curr-icon silver">⚪</span> 890</div>
        <div class="currency"><span class="curr-icon gold">🟡</span> <span id="ui-gold">1658</span></div>
        <div class="currency"><span class="curr-icon diamond">💎</span> <span id="ui-diamond">12</span></div>
    </div>
</header>
`;
