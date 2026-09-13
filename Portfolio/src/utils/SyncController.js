/**
 * SyncController — Master Audio/Video Synchronization
 *
 * El video actúa como el master clock.
 * El audio se ajusta periódicamente si hay drift > threshold.
 * Todos los controles de reproducción pasan por este controlador.
 */

(function () {
  'use strict';

  class SyncController {
    /**
     * @param {HTMLVideoElement} videoEl
     * @param {HTMLAudioElement} audioEl
     * @param {number} driftThreshold — segundos de tolerancia antes de corregir
     */
    constructor(videoEl, audioEl, driftThreshold = 0.15) {
      this.video = videoEl;
      this.audio = audioEl;
      this.driftThreshold = driftThreshold;
      this.isReady = false;
      this.syncInterval = null;
      this.SYNC_CHECK_MS = 1000; // Revisar sync cada 1 segundo
      this.PLAY_TIMEOUT_MS = 4000;
      this._listeners = {};
      this._correcting = false;
      this.isStarting = false;
      this.isDestroyed = false;
      this.hasStarted = false;
      this.isAudioStarting = false;
      this._audioAttemptId = 0;
      this._startPromise = null;
      this._domListeners = [];

      this._bindVideoEvents();
    }

    // ── SETUP ────────────────────────────────────────────────

    _bindVideoEvents() {
      const addListener = (element, event, handler) => {
        element.addEventListener(event, handler);
        this._domListeners.push({ element, event, handler });
      };

      // Cuando el video carga suficiente para reproducir
      addListener(this.video, 'canplay', () => {
        if (this.isDestroyed) return;
        this.isReady = true;
        this._emit('ready');
      });

      // Sincronizar pausa cuando el video se pausa externamente
      addListener(this.video, 'pause', () => {
        if (this.isDestroyed) return;
        if (!this.audio.paused) {
          this.audio.pause();
        }
        this._stopSyncCheck();
        this._emit('pause');
      });

      // Sincronizar play cuando el video reanuda externamente
      addListener(this.video, 'play', () => {
        if (this.isDestroyed) return;
        console.debug('[SyncController] VIDEO PLAY');

        // play() ya inició ambos elementos durante el gesto del usuario.
        // Este evento solo observa el video y mantiene el flujo único.
        if (!this.isStarting) {
          this._syncAudioToVideo();
          this._attemptAudioPlay();
        }

        this._startSyncCheck();
        this._emit('play');
      });

      // Cuando el usuario hace seeking en el video
      addListener(this.video, 'seeking', () => {
        if (this.isDestroyed) return;
        this._correcting = true;
      });

      addListener(this.video, 'seeked', () => {
        if (this.isDestroyed) return;
        this._syncAudioToVideo();
        this._correcting = false;
        this._emit('seeking');
      });

      // Fin de reproducción
      addListener(this.video, 'ended', () => {
        if (this.isDestroyed) return;
        this.audio.pause();
        this._stopSyncCheck();
        this._emit('ended');
      });

      // Timeupdate (para el reproductor)
      addListener(this.video, 'timeupdate', () => {
        if (this.isDestroyed) return;
        this._emit('timeupdate', {
          currentTime: this.video.currentTime,
          duration: this.video.duration || 0
        });
      });

      // Error de video
      addListener(this.video, 'error', (e) => {
        console.warn('[SyncController] Video error:', e);
        this._emit('error', { source: 'video', event: e });
      });

      // Error de audio
      addListener(this.audio, 'error', (e) => {
        console.warn('[SyncController] Audio error:', e);
        this._emit('error', { source: 'audio', event: e });
      });

      // Reintentar solo después de que el usuario ya haya iniciado el sitio.
      const retryAudio = () => {
        if (this.hasStarted && !this.video.paused) {
          this._attemptAudioPlay();
        }
      };
      addListener(this.audio, 'canplay', retryAudio);
      addListener(this.audio, 'loadeddata', retryAudio);
    }

    // ── CONTROL PRINCIPAL ────────────────────────────────────

    /**
     * Inicia la reproducción desde 0 (o desde un timestamp específico).
     * Llama esto al hacer click en "ENTRAR".
     */
    play(fromTime = 0) {
      return this._startPlayback(fromTime, true);
    }

    pause() {
      if (this.isDestroyed) return;
      this.video.pause();
      if (this.video.paused) {
        if (!this.audio.paused) {
          this.audio.pause();
        }
        this._stopSyncCheck();
      }
    }

    resume() {
      if (this.isDestroyed) return Promise.resolve(false);
      return this._startPlayback(this.video.currentTime, false);
    }

    toggle() {
      if (this.video.paused) {
        this.resume();
      } else {
        this.pause();
      }
    }

    seek(time) {
      if (this.isDestroyed) return;
      this.video.currentTime = time;
      this.audio.currentTime = time;
    }

    restart() {
      this.seek(0);
      this.resume();
    }

    get isPlaying() {
      return !this.video.paused;
    }

    get currentTime() {
      return this.video.currentTime;
    }

    get duration() {
      return this.video.duration || this.audio.duration || 0;
    }

    // ── VOLUMEN ──────────────────────────────────────────────

    setVolume(v) {
      const vol = Math.min(1, Math.max(0, v));
      this.audio.volume = vol;
      this._emit('volumechange', { volume: vol, muted: this.audio.muted });
    }

    get volume() {
      return this.audio.volume;
    }

    mute() {
      this.audio.muted = true;
      this._emit('volumechange', { volume: this.audio.volume, muted: true });
    }

    unmute() {
      this.audio.muted = false;
      this._emit('volumechange', { volume: this.audio.volume, muted: false });
    }

    toggleMute() {
      if (this.audio.muted) {
        this.unmute();
      } else {
        this.mute();
      }
      return this.audio.muted;
    }

    get isMuted() {
      return this.audio.muted;
    }

    // ── SYNC CHECK ───────────────────────────────────────────

    _startSyncCheck() {
      if (this.isDestroyed || this.syncInterval) return;
      console.debug('[SyncController] SYNC START');
      this.syncInterval = setInterval(() => {
        this._checkDrift();
      }, this.SYNC_CHECK_MS);
    }

    _stopSyncCheck() {
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
        this.syncInterval = null;
      }
    }

    _checkDrift() {
      if (this._correcting || this.video.paused || this.audio.paused) return;

      const drift = Math.abs(this.video.currentTime - this.audio.currentTime);

      if (drift > this.driftThreshold) {
        console.debug(`[SyncController] Drift ${drift.toFixed(3)}s → correcting`);
        this._syncAudioToVideo();
      }
    }

    _syncAudioToVideo() {
      if (Math.abs(this.audio.currentTime - this.video.currentTime) > 0.05) {
        this.audio.currentTime = this.video.currentTime;
      }
    }

    _startPlayback(fromTime, resetPosition) {
      if (this.isDestroyed) return Promise.resolve(false);
      if (this.isStarting) {
        console.debug('[SyncController] PLAY BLOCKED: already starting');
        return this._startPromise || Promise.resolve(false);
      }

      this.isStarting = true;
      this.hasStarted = true;
      console.debug('[SyncController] START');

      if (resetPosition) {
        this.video.currentTime = fromTime;
        this.audio.currentTime = fromTime;
      } else {
        this._syncAudioToVideo();
      }

      this.video.muted = true;

      // Ambas llamadas ocurren en la misma tarea iniciada por el gesto del usuario.
      let videoPromise;
      try {
        videoPromise = this.video.play();
      } catch (error) {
        videoPromise = Promise.reject(error);
      }
      this._attemptAudioPlay();

      this._startPromise = this._withTimeout(videoPromise, this.PLAY_TIMEOUT_MS, 'video')
        .then(() => true)
        .catch((error) => {
          console.warn('[SyncController] PLAY BLOCKED', error);
          this._emit('playBlocked', error);
          return false;
        })
        .finally(() => {
          this.isStarting = false;
          this._startPromise = null;
        });

      return this._startPromise;
    }

    _attemptAudioPlay() {
      if (this.isDestroyed || this.isAudioStarting || !this.audio.paused) return;

      this._syncAudioToVideo();
      this.isAudioStarting = true;
      const attemptId = ++this._audioAttemptId;
      let audioPromise;
      try {
        audioPromise = this.audio.play();
      } catch (error) {
        audioPromise = Promise.reject(error);
      }
      if (audioPromise && typeof audioPromise.then === 'function') {
        this._withTimeout(audioPromise, this.PLAY_TIMEOUT_MS, 'audio')
          .then(() => console.debug('[SyncController] AUDIO PLAY'))
          .catch((error) => {
            console.warn('[SyncController] PLAY BLOCKED: audio', error);
            this._emit('playBlocked', error);
          })
          .finally(() => {
            if (this._audioAttemptId === attemptId) {
              this.isAudioStarting = false;
            }
          });
      } else {
        this.isAudioStarting = false;
      }
    }

    _withTimeout(promise, timeoutMs, source) {
      let timeoutId;
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${source} play timed out`));
        }, timeoutMs);
      });

      return Promise.race([Promise.resolve(promise), timeout])
        .finally(() => clearTimeout(timeoutId));
    }

    // ── EVENTOS ──────────────────────────────────────────────

    on(event, callback) {
      if (this.isDestroyed) return this;
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(callback);
      return this; // Encadenable
    }

    off(event, callback) {
      if (this._listeners[event]) {
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
      }
    }

    _emit(event, data) {
      if (this._listeners[event]) {
        this._listeners[event].forEach(cb => {
          try { cb(data); } catch (e) { console.warn('[SyncController] Listener error:', e); }
        });
      }
    }

    destroy() {
      if (this.isDestroyed) return;
      console.debug('[SyncController] DESTROY');
      this._stopSyncCheck();
      this._domListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this._domListeners = [];
      this.isDestroyed = true;
      this._listeners = {};
    }
  }

  // Exponer globalmente
  window.SyncController = SyncController;

})();
