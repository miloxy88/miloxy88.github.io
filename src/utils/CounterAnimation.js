/**
 * CounterAnimation — Anima números desde 0 hasta el valor objetivo
 * cuando el elemento entra al viewport.
 */

(function () {
  'use strict';

  /**
   * Anima un número de 0 a target en una duración dada.
   * @param {HTMLElement} el — Elemento que contiene el número
   * @param {string} rawValue — Valor final como string (puede tener sufijos como "M+", "K", etc.)
   * @param {number} duration — Milisegundos de animación
   */
  function animateCounter(el, rawValue, duration = 1800) {
    // Extraer solo el número del string (ej: "1M+" → no es numérico puro)
    const numericMatch = rawValue.match(/^(\d+(?:\.\d+)?)(.*)/);

    if (!numericMatch) {
      // Si no hay número (ej: "Roblox", "Lua/Luau", "AI"), mostrarlo directamente
      el.textContent = rawValue;
      return;
    }

    const targetNum = parseFloat(numericMatch[1]);
    const suffix = numericMatch[2] || ''; // Ej: "M+" o "+"

    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = targetNum * easedProgress;

      // Formatear número
      let formatted;
      if (targetNum >= 1000000) {
        formatted = (current / 1000000).toFixed(current >= 1000000 ? 0 : 1) + 'M';
      } else if (targetNum >= 1000) {
        formatted = (current / 1000).toFixed(current >= 1000 ? 0 : 1) + 'K';
      } else if (Number.isInteger(targetNum)) {
        formatted = Math.round(current).toLocaleString();
      } else {
        formatted = current.toFixed(1);
      }

      el.textContent = formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = rawValue; // Asegurar valor exacto al final
      }
    }

    requestAnimationFrame(tick);
  }

  /**
   * Inicializa la animación de contadores via IntersectionObserver.
   * Busca elementos con [data-count-value].
   */
  function initCounters() {
    const elements = document.querySelectorAll('[data-count-value]');

    if (!elements.length) return;

    // Si no hay soporte para IntersectionObserver, mostrar directamente
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => {
        el.textContent = el.dataset.countValue;
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawValue = el.dataset.countValue;
          const duration = parseInt(el.dataset.countDuration || '1800', 10);
          animateCounter(el, rawValue, duration);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -20px 0px'
    });

    elements.forEach(el => {
      observer.observe(el);
    });
  }

  window.CounterAnimation = { init: initCounters, animate: animateCounter };

})();
