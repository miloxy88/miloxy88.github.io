/**
 * MILO — Archivo de configuración central
 * Edita este archivo para actualizar toda la información del sitio.
 * No es necesario modificar ningún componente para cambiar datos personales.
 */

const PROFILE = {

  // ── INFORMACIÓN PERSONAL ──────────────────────────────────────
  name: "MILO",
  tagline: "Developer / Creator",
  description: "Desarrollador de videojuegos, creador de proyectos y entusiasta de la tecnología.",

  about: [
    "Soy una persona interesada en la programación, el desarrollo de videojuegos y las nuevas tecnologías.",
    "Principalmente trabajo con Roblox Studio y Lua/Luau, creando sistemas, mecánicas y experiencias interactivas.",
    "También utilizo herramientas de Inteligencia Artificial como apoyo para aprender, desarrollar proyectos, investigar tecnologías y resolver problemas."
  ],

  roles: [
    "Roblox Developer",
    "Lua / Luau",
    "Web Dev",
    "AI Projects"
  ],

  // ── MEDIA ────────────────────────────────────────────────────
  media: {
    video: "assets/video/Santa Fe Klan - Así Soy (Lyric Video) - Santa Fe Klan Official (1080p, h264).mp4",
    audio: "assets/audio/Santa Fe Klan - Así Soy.mp3",
    songTitle: "Así Soy",
    songArtist: "La Santa Grifa",
    poster: ""
  },

  // ── REDES SOCIALES ────────────────────────────────────────────
  // Reemplaza "#" con la URL real de tu perfil
  socials: {
    discord: {
      label: "Discord",
      handle: "milo79",
      url: "#",         // Ej: "https://discord.com/users/TU_ID"
      color: "#5865F2"
    },
    discordServer: {
      label: "Servidor de Discord",
      url: "#",         // Ej: "https://discord.gg/TU_INVITACION"
    },
    instagram: {
      label: "Instagram",
      handle: "@miloxy88",
      url: "#",         // Ej: "https://instagram.com/miloxy88"
      color: "#E1306C"
    },
    spotify: {
      label: "Spotify",
      handle: "Milo",
      url: "#",         // Ej: "https://open.spotify.com/user/TU_ID"
      color: "#1DB954"
    }
  },

  // ── ESTADÍSTICAS ──────────────────────────────────────────────
  stats: [
    { value: "Roblox", label: "Plataforma principal", suffix: "" },
    { value: "Lua/Luau", label: "Lenguaje principal", suffix: "" },
    { value: "Studio", label: "Motor de desarrollo", suffix: "" },
    { value: "AI", label: "Herramienta de desarrollo", suffix: "" }
  ],

  // ── PROYECTOS / EXPERIENCIA ───────────────────────────────────
  projects: [
    {
      id: "roblox",
      category: "Desarrollo de Videojuegos",
      title: "Roblox Studio",
      type: "Proyecto personal",
      accent: "#c0392b",
      icon: "🎮",
      highlights: [
        "Creación y desarrollo de videojuegos en Roblox Studio",
        "Programación de sistemas y mecánicas con Lua/Luau",
        "Un videojuego superó <strong>1.000.000 de visitas</strong>",
        "Diseño, programación, pruebas y mejora continua"
      ],
      tags: ["Roblox Studio", "Lua", "Luau", "Game Design"]
    },
    {
      id: "ai",
      category: "Proyectos con IA",
      title: "Inteligencia Artificial",
      type: "Proyectos personales",
      accent: "#d4a24c",
      icon: "🤖",
      highlights: [
        "Uso de IA como apoyo para el desarrollo de proyectos",
        "Generación, análisis y mejora de código mediante IA",
        "Investigación de tecnologías y resolución de problemas",
        "Integración de IA como herramienta de aprendizaje y productividad"
      ],
      tags: ["AI Tools", "Prompt Engineering", "Code Generation", "Research"]
    }
  ],

  // ── HABILIDADES ───────────────────────────────────────────────
  skills: [
    {
      category: "Desarrollo Web",
      icon: "🌐",
      items: [
        { name: "HTML", level: "Básico" },
        { name: "CSS", level: "Básico" },
        { name: "Bootstrap", level: "Básico" }
      ]
    },
    {
      category: "Bases de Datos",
      icon: "🗄️",
      items: [
        { name: "MySQL", level: "Básico" }
      ]
    },
    {
      category: "Desarrollo de Videojuegos",
      icon: "🎮",
      items: [
        { name: "Roblox Studio", level: "Avanzado" },
        { name: "Lua / Luau", level: "Avanzado" }
      ]
    },
    {
      category: "Inteligencia Artificial",
      icon: "🤖",
      items: [
        { name: "Uso avanzado de herramientas IA", level: "Avanzado" },
        { name: "Integración de IA en proyectos", level: "Avanzado" },
        { name: "Prompt Engineering", level: "Avanzado" }
      ]
    }
  ],

  // ── IDIOMAS ───────────────────────────────────────────────────
  languages: [
    {
      flag: "🇪🇸",
      language: "Español",
      level: "Idioma nativo",
      code: "Native"
    },
    {
      flag: "🇬🇧",
      language: "Inglés",
      level: "Nivel A1 — Curso UTN aprobado",
      code: "A1"
    }
  ],

  // ── PALETA ──────────────────────────────────────────────────
  // Puedes ajustar colores globales aquí (se aplican como CSS variables)
  colors: {
    accent: "#c0392b",
    accentDark: "#8b1a1a",
    warm: "#d4a24c"
  }

};

// Exponer globalmente
window.PROFILE = PROFILE;
