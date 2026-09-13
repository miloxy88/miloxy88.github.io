/**
 * IntroScreen — Pantalla de entrada "ENTRAR"
 * Maneja la experiencia inicial y dispara el SyncController al hacer click.
 */

(function () {
  'use strict';

  function initIntroScreen(syncController, onEnter) {
    const intro = document.getElementById('intro-screen');
    const enterBtn = document.getElementById('intro-enter-btn');

    if (!intro || !enterBtn) {
      console.warn('[IntroScreen] Elements not found');
      return;
    }

    let hasEntered = false;

    function enter() {
      if (hasEntered) return;
      hasEntered = true;

      enterBtn.disabled = true;
      enterBtn.style.pointerEvents = 'none';
      document.removeEventListener('keydown', handleKeydown);

      // Disparar el arranque desde el gesto, sin bloquear la entrada.
      syncController.play(0).catch((error) => {
        console.warn('[IntroScreen] Media start failed:', error);
      });

      // Ocultar intro con transición
      intro.classList.add('hidden');

      // Mostrar el reproductor de música
      const player = document.getElementById('music-player');
      if (player) {
        setTimeout(() => {
          player.classList.remove('hidden');
        }, 600);
      }

      // Callback externo (si necesita inicializar algo más)
      if (typeof onEnter === 'function') {
        setTimeout(onEnter, 400);
      }
    }

    // Click en botón
    enterBtn.addEventListener('click', enter);

    // También permite entrar con Enter/Space (accesibilidad)
    enterBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enter();
      }
    });

    // También permite entrar presionando cualquier tecla
    const handleKeydown = (e) => {
      if (e.key !== 'Tab') { // No activar con Tab (accesibilidad)
        document.removeEventListener('keydown', handleKeydown);
        enter();
      }
    };
    document.addEventListener('keydown', handleKeydown);
  }

  window.initIntroScreen = initIntroScreen;

})();
