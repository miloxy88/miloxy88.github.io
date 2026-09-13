/**
 * MusicPlayer — Reproductor flotante sincronizado con SyncController
 */

(function () {
  'use strict';

  function initMusicPlayer(syncController) {
    const player     = document.getElementById('music-player');
    const btnPlay    = document.getElementById('player-play');
    const btnMute    = document.getElementById('player-mute');
    const progressFill = document.getElementById('player-progress-fill');
    const progressBar  = document.getElementById('player-progress-bar');
    const timeEl     = document.getElementById('player-time-current');
    const durationEl = document.getElementById('player-time-duration');
    const volumeSlider = document.getElementById('player-volume');
    const disc       = document.getElementById('player-disc');

    if (!player || !syncController) return;

    // ── FORMATO DE TIEMPO ───────────────────────────────────
    function formatTime(secs) {
      if (isNaN(secs) || !isFinite(secs)) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // ── ACTUALIZAR UI ───────────────────────────────────────
    function updatePlayBtn(isPlaying) {
      if (!btnPlay) return;
      btnPlay.innerHTML = isPlaying
        ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="4" height="10" rx="1"/><rect x="7" y="1" width="4" height="10" rx="1"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1l9 5-9 5V1z"/></svg>';
      btnPlay.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproducir');

      if (disc) {
        disc.classList.toggle('spinning', isPlaying);
      }
    }

    function updateMuteBtn(isMuted) {
      if (!btnMute) return;
      btnMute.innerHTML = isMuted
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
      btnMute.setAttribute('aria-label', isMuted ? 'Activar sonido' : 'Silenciar');
    }

    // ── LISTENERS DEL SYNC CONTROLLER ──────────────────────
    syncController.on('timeupdate', ({ currentTime, duration }) => {
      const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
      if (progressFill) progressFill.style.width = pct + '%';
      if (timeEl)     timeEl.textContent = formatTime(currentTime);
      if (durationEl) durationEl.textContent = formatTime(duration);
    });

    syncController.on('play', () => updatePlayBtn(true));
    syncController.on('pause', () => updatePlayBtn(false));

    syncController.on('volumechange', ({ muted }) => {
      updateMuteBtn(muted);
    });

    // ── CONTROLES ───────────────────────────────────────────

    // Play/Pause
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        syncController.toggle();
      });
    }

    // Mute
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        syncController.toggleMute();
      });
    }

    // Volumen
    if (volumeSlider) {
      volumeSlider.value = syncController.volume;

      volumeSlider.addEventListener('input', () => {
        const vol = parseFloat(volumeSlider.value);
        syncController.setVolume(vol);
        if (vol === 0) {
          syncController.mute();
        } else if (syncController.isMuted) {
          syncController.unmute();
        }
      });

      syncController.on('volumechange', ({ volume }) => {
        volumeSlider.value = volume;
      });
    }

    // Barra de progreso — click para seek
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width;
        const seekTime = pct * syncController.duration;
        syncController.seek(seekTime);
      });
    }

    // Estado inicial
    updatePlayBtn(syncController.isPlaying);
    updateMuteBtn(syncController.isMuted);
  }

  window.initMusicPlayer = initMusicPlayer;

})();
