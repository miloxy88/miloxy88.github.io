/**
 * ScrollObserver — Intersection Observer para animaciones al hacer scroll
 * Aplica la clase .anim-visible cuando los elementos entran al viewport.
 */

(function () {
  'use strict';

  class ScrollObserver {
    constructor(options = {}) {
      this.threshold = options.threshold || 0.15;
      this.rootMargin = options.rootMargin || '0px 0px -40px 0px';
      this._observer = null;
      this._init();
    }

    _init() {
      // Si el browser no soporta IntersectionObserver, mostrar todo
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.anim-init, .anim-fade, .anim-slide-left, .anim-scale').forEach(el => {
          el.classList.add('anim-visible');
        });
        return;
      }

      this._observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('anim-visible');
              // Una vez visible, dejar de observar (mejor rendimiento)
              this._observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: this.threshold,
          rootMargin: this.rootMargin
        }
      );

      this._observeAll();
    }

    _observeAll() {
      const selectors = [
        '.anim-init',
        '.anim-fade',
        '.anim-slide-left',
        '.anim-scale'
      ].join(', ');

      document.querySelectorAll(selectors).forEach(el => {
        this._observer.observe(el);
      });
    }

    /**
     * Observar un elemento adicional después de la inicialización
     */
    observe(el) {
      if (this._observer) {
        this._observer.observe(el);
      } else {
        el.classList.add('anim-visible');
      }
    }

    /**
     * Re-escanear el DOM para nuevos elementos
     */
    refresh() {
      this._observeAll();
    }

    destroy() {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
    }
  }

  window.ScrollObserver = ScrollObserver;

})();
