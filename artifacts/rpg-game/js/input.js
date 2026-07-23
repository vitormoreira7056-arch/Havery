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
            y: 0,
            identifier: null
        };

        this._initKeyboardListeners();
        this._initDynamicJoystick();
    }

    _initKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys[key] !== undefined) this.keys[key] = true;
            if (this.keys[e.key] !== undefined) this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keys[key] !== undefined) this.keys[key] = false;
            if (this.keys[e.key] !== undefined) this.keys[e.key] = false;
        });
    }

    _initDynamicJoystick() {
        const container = document.getElementById('joystick-container');
        const stick = document.getElementById('joystick-stick');
        const gameContainer = document.getElementById('game-container');
        
        let startX = 0;
        let startY = 0;
        let maxDistance = 40;

        const handleStart = (clientX, clientY, identifier = null) => {
            if (this.joystick.active) return;

            const rect = gameContainer.getBoundingClientRect();
            
            this.joystick.active = true;
            this.joystick.identifier = identifier;
            
            startX = clientX;
            startY = clientY;

            container.style.left = `${startX - rect.left}px`;
            container.style.top = `${startY - rect.top}px`;
            container.classList.add('active');

            stick.style.transform = `translate(0px, 0px)`;
            this.joystick.x = 0;
            this.joystick.y = 0;
        };

        const handleMove = (clientX, clientY, identifier = null) => {
            if (!this.joystick.active) return;
            if (identifier !== null && this.joystick.identifier !== identifier) return;

            let deltaX = clientX - startX;
            let deltaY = clientY - startY;

            let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > maxDistance) {
                deltaX = (deltaX / distance) * maxDistance;
                deltaY = (deltaY / distance) * maxDistance;
            }

            stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

            this.joystick.x = deltaX / maxDistance;
            this.joystick.y = deltaY / maxDistance;
        };

        const handleEnd = (identifier = null) => {
            if (!this.joystick.active) return;
            if (identifier !== null && this.joystick.identifier !== identifier) return;

            this.joystick.active = false;
            this.joystick.identifier = null;
            this.joystick.x = 0;
            this.joystick.y = 0;
            container.classList.remove('active');
        };

        window.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            handleStart(touch.clientX, touch.clientY, touch.identifier);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === this.joystick.identifier) {
                    handleMove(touch.clientX, touch.clientY, touch.identifier);
                }
            }
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === this.joystick.identifier) {
                    handleEnd(touch.identifier);
                }
            }
        });

        gameContainer.addEventListener('mousedown', (e) => {
            handleStart(e.clientX, e.clientY);
        });

        window.addEventListener('mousemove', (e) => {
            handleMove(e.clientX, e.clientY);
        });

        window.addEventListener('mouseup', () => {
            handleEnd();
        });
    }

    getAxis() {
        let dx = 0;
        let dy = 0;

        if (this.keys['w'] || this.keys['ArrowUp']) dy -= 1;
        if (this.keys['s'] || this.keys['ArrowDown']) dy += 1;
        if (this.keys['a'] || this.keys['ArrowLeft']) dx -= 1;
        if (this.keys['d'] || this.keys['ArrowRight']) dx += 1;

        if (dx !== 0 || dy !== 0) {
            if (dx !== 0 && dy !== 0) {
                dx *= 0.7071;
                dy *= 0.7071;
            }
            return { dx, dy };
        }

        if (this.joystick.active) {
            return { dx: this.joystick.x, dy: this.joystick.y };
        }

        return { dx: 0, dy: 0 };
    }
}
