export class UIManager {
    constructor() {
        // Elementos do Cabeçalho
        this.btnMenu = document.getElementById('btn-menu');
        this.dropdownMenu = document.getElementById('dropdown-menu');
        
        this.btnProfile = document.getElementById('btn-profile');
        this.btnBuffs = document.getElementById('btn-buffs');

        // Navegação Inferior
        this.navItems = document.querySelectorAll('.nav-item');

        this.bindEvents();
    }

    bindEvents() {
        // Alternar Menu Suspenso
        this.btnMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique feche imediatamente
            this.dropdownMenu.classList.toggle('hidden');
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.dropdownMenu.contains(e.target) && e.target !== this.btnMenu) {
                this.dropdownMenu.classList.add('hidden');
            }
        });

        // Clique no Perfil
        this.btnProfile.addEventListener('click', () => {
            console.log("Abrir painel detalhado do personagem (Em desenvolvimento)");
            // Futuramente abrirá o modal de status completos
        });

        // Clique em Buffs
        this.btnBuffs.addEventListener('click', () => {
            console.log("Abrir modal de Buffs Ativos (Ex: XP bônus 24h)");
        });

        // Navegação Inferior (Alternar abas)
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove ativo de todos
                this.navItems.forEach(nav => nav.classList.remove('active'));
                // Adiciona ativo no clicado
                item.classList.add('active');
                
                const targetView = item.getAttribute('data-target');
                console.log(`Carregando a tela: ${targetView}`);
                
                // Futuramente chamaremos a função para limpar o #main-content 
                // e renderizar a tela correta (Mundo, Missões, Loja, etc.)
            });
        });
    }
}

// Inicializa a UI quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
    new UIManager();
});
