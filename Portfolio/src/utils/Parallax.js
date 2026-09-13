/**
 * Parallax — Efecto de parallax sutil basado en movimiento del mouse
 * Mueve ligeramente el fondo de video en respuesta al cursor.
 */

(function () {
  'use strict';

  class Parallax {
    /**
     * @param {HTMLElement} target — El elemento a mover (video de fondo)
     * @param {number} intensity — Qué tan pronunciado es el efecto (0 a 1)
     */
    constructor(target, intensity = 0.012) {
      this.target = target;
      this.intensity = intensity;
      this.currentX = 0;
      this.currentY = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.isActive = true;
      this._rafId = null;
      this._handleMouseMove = this._handleMouseMove.bind(this);
      this._animate = this._animate.bind(this);

      // Respetar prefers-reduced-motion
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        return; // No inicializar si prefiere menos movimiento
      }

      this._init();

      motionQuery.addEventListener('change', (e) => {
        if (e.matches) {
          this.destroy();
        }
      });
    }

    _init() {
      window.addEventListener('mousemove', this._handleMouseMove, { passive: true });
      this._animate();
    }

    _handleMouseMove(e) {
      if (!this.isActive) return;

      // Normalizar a rango [-1, 1]
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // El target es el movimiento máximo en píxeles
      const maxMove = 20;
      this.targetX = -x * maxMove * this.intensity * 100;
      this.targetY = -y * maxMove * this.intensity * 100;
    }

    _animate() {
      if (!this.isActive) return;

      // Lerp suave (easing)
      const ease = 0.05;
      this.currentX += (this.targetX - this.currentX) * ease;
      this.currentY += (this.targetY - this.currentY) * ease;

      // Solo aplicar si hay movimiento significativo
      if (Math.abs(this.currentX) > 0.01 || Math.abs(this.currentY) > 0.01) {
        // Usar scale ligeramente superior en el video para cubrir los márgenes
        this.target.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(1.06)`;
      }

      this._rafId = requestAnimationFrame(this._animate);
    }

    pause() {
      this.isActive = false;
    }

    resume() {
      this.isActive = true;
      this._animate();
    }

    destroy() {
      this.isActive = false;
      window.removeEventListener('mousemove', this._handleMouseMove);
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
      if (this.target) {
        this.target.style.transform = '';
      }
    }
  }

  window.Parallax = Parallax;

})();
