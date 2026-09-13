# MILO — Portfolio Personal

Portfolio web personal con estética urbana/mexicana, video de fondo, música sincronizada y diseño responsive.

## 📁 Estructura del proyecto

```
Portfolio/
├── index.html                  ← Punto de entrada
├── assets/
│   ├── video/
│   │   └── background.mp4      ← ⚠️ DEBES COLOCAR TU VIDEO AQUÍ
│   ├── audio/
│   │   └── asi-soy.mp3         ← ⚠️ DEBES COLOCAR TU AUDIO AQUÍ
│   └── images/
│       └── poster.jpg          ← (Opcional) Frame de portada del video
└── src/
    ├── config/
    │   └── profile.js          ← ✅ EDITA AQUÍ TU INFORMACIÓN PERSONAL
    ├── styles/                 ← CSS por componente
    ├── utils/                  ← SyncController, ScrollObserver, etc.
    └── components/             ← Lógica de cada componente
```

---

## 🎵 Archivos de media configurados

### Video de fondo
- Ruta: `assets/video/Santa Fe Klan - Así Soy (Lyric Video) - Santa Fe Klan Official (1080p, h264).mp4`
- Lyric video oficial de "Así Soy" (1080p).

### Audio
- Ruta: `assets/audio/Santa Fe Klan - Así Soy.mp3`
- Canción "Así Soy" de Santa Fe Klan / La Santa Grifa.

> Los archivos ya están cargados y enlazados en la aplicación.

---

## ✏️ Cómo personalizar

Edita únicamente el archivo [`src/config/profile.js`](src/config/profile.js).

### Cambiar redes sociales

```javascript
socials: {
  discord: {
    url: "https://discord.com/users/TU_ID_AQUI"
  },
  instagram: {
    url: "https://instagram.com/TU_USUARIO"
  },
  spotify: {
    url: "https://open.spotify.com/user/TU_ID"
  }
}
```

### Cambiar colores de acento

```javascript
colors: {
  accent:     "#c0392b",  // Rojo/vino
  accentDark: "#8b1a1a",  // Rojo oscuro
  warm:       "#d4a24c"   // Dorado/cálido
}
```

---

## 🚀 Cómo abrir

Simplemente abre `index.html` en tu navegador.

Para mejor experiencia (sin restricciones de CORS), puedes usar un servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node.js (npx)
npx serve .
```

Luego abre: `http://localhost:8080`

---

## 🎮 Funcionalidades

| Feature | Estado |
|---|---|
| Pantalla de entrada "ENTRAR" | ✅ |
| Video de fondo full-screen | ✅ |
| Audio sincronizado con video | ✅ |
| Corrección automática de drift | ✅ |
| Reproductor flotante | ✅ |
| Film grain + vignette | ✅ |
| Animaciones al scroll | ✅ |
| Parallax con el mouse | ✅ |
| Contador de 1M+ visitas | ✅ |
| Menú responsive (móvil) | ✅ |
| Modo reduced-motion | ✅ |
| Accesibilidad (aria) | ✅ |

---

## 🎨 Paleta visual

| Color | Hex | Uso |
|---|---|---|
| Negro base | `#080808` | Fondo |
| Superficie | `#111111` | Cards |
| Acento | `#c0392b` | Rojo/vino |
| Cálido | `#d4a24c` | Dorado |
| Texto | `#f0f0f0` | Texto principal |

---

## 📱 Responsive

- ✅ Desktop (1920px, 1440px, 1280px)
- ✅ Laptop (1200px)
- ✅ Tablet (900px)
- ✅ Móvil (640px)
- ✅ Móvil pequeño (400px)
- ✅ Landscape móvil

---

## 🛠️ Tecnologías

- HTML5 semántico
- CSS3 + Custom Properties (sin frameworks)
- JavaScript Vanilla (sin librerías)
- Google Fonts: Bebas Neue + Inter
- Intersection Observer API
- Web Audio API compatible

---

© 2026 Milo
