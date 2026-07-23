export class InputHandler {
    constructor() {
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        this.joystick = {
            active: false,
            x: 0,
            y: 0
        };

        this._initKeyboardListeners();
        this._initVirtualJoystick();
    }

    _initKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key) || this.keys.hasOwnProperty(e.code)) {
                const key = e.key.toLowerCase();
                if (this.keys[key] !== undefined) this.keys[key] = true;
                if (this.keys[e.key] !== undefined) this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys[key] !== undefined) this.keys[key] = false;
            if (this.keys[e.key] !== undefined) this.keys[e.key] = false;
        });
    }

    _initVirtualJoystick() {
        const base = document.getElementById('joystick-base');
        const stick = document.getElementById('joystick-stick');
        let rect = base.getBoundingClientRect();
        let maxDistance = 40;

        const handleTouchStart = (e) => {
            this.joystick.active = true;
            updateTouchPosition(e.touches[0]);
        };

        const handleTouchMove = (e) => {
            if (!this.joystick.active) return;
            updateTouchPosition(e.touches[0]);
        };

        const handleTouchEnd = () => {
            this.joystick.active = false;
            this.joystick.x = 0;
            this.joystick.y = 0;
            stick.style.transform = `translate(0px, 0px)`;
        };

        const updateTouchPosition = (touch) => {
            rect = base.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;
            
            let deltaX = touch.clientX - centerX;
            let deltaY = touch.clientY - centerY;
            
            let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > maxDistance) {
                deltaX = (deltaX / distance) * maxDistance;
                deltaY = (deltaY / distance) * maxDistance;
            }

            stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // Normaliza os valores entre -1 e 1
            this.joystick.x = deltaX / maxDistance;
            this.joystick.y = deltaY / maxDistance;
        };

        base.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    }

    getAxis() {
        let dx = 0;
        let dy = 0;

        // Verifica Teclado
        if (this.keys['w'] || this.keys['ArrowUp']) dy -= 1;
        if (this.keys['s'] || this.keys['ArrowDown']) dy += 1;
        if (this.keys['a'] || this.keys['ArrowLeft']) dx -= 1;
        if (this.keys['d'] || this.keys['ArrowRight']) dx += 1;

        // Se o teclado estiver sendo usado, ele tem prioridade
        if (dx !== 0 || dy !== 0) {
            // Normaliza diagonal do teclado
            if (dx !== 0 && dy !== 0) {
                dx *= 0.7071;
                dy *= 0.7071;
            }
            return { dx, dy };
        }

        // Caso contrário, usa o joystick virtual se estiver ativo
        if (this.joystick.active) {
            return { dx: this.joystick.x, dy: this.joystick.y };
        }

        return { dx: 0, dy: 0 };
    }
}
