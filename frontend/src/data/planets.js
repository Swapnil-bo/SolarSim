import { useTexture } from '@react-three/drei'

const planets = [
  {
    name: "Mercury",
    radius: 0.38,
    distance: 10,
    speed: 0.04,
    rotationSpeed: 0.003,
    tilt: 0.034,
    textureFile: "mercury.jpg",
    color: "#a0a0a0",
    moons: [],
    facts: {
      diameter: "4,879 km",
      distanceFromSun: "57.9 million km",
      orbitalPeriod: "88 days",
      moons: 0,
      description: "The smallest planet and closest to the Sun, with extreme temperature swings from -180°C to 430°C."
    }
  },
  {
    name: "Venus",
    radius: 0.95,
    distance: 16,
    speed: 0.015,
    rotationSpeed: 0.002,
    tilt: 177.4,
    textureFile: "venus.jpg",
    color: "#e8cda0",
    moons: [],
    facts: {
      diameter: "12,104 km",
      distanceFromSun: "108.2 million km",
      orbitalPeriod: "225 days",
      moons: 0,
      description: "The hottest planet with a thick toxic atmosphere of carbon dioxide and sulfuric acid clouds."
    }
  },
  {
    name: "Earth",
    radius: 1.0,
    distance: 22,
    speed: 0.01,
    rotationSpeed: 0.005,
    tilt: 23.5,
    textureFile: "earth.jpg",
    color: "#4fc3f7",
    moons: [
      { name: "Moon", radius: 0.27, distance: 2.5, speed: 0.05, textureFile: "moon.jpg" }
    ],
    facts: {
      diameter: "12,742 km",
      distanceFromSun: "149.6 million km",
      orbitalPeriod: "365.25 days",
      moons: 1,
      description: "The only known planet to harbour life, with liquid water on its surface and a protective magnetic field."
    }
  },
  {
    name: "Mars",
    radius: 0.53,
    distance: 28,
    speed: 0.008,
    rotationSpeed: 0.005,
    tilt: 25.2,
    textureFile: "mars.jpg",
    color: "#c1440e",
    moons: [],
    facts: {
      diameter: "6,779 km",
      distanceFromSun: "227.9 million km",
      orbitalPeriod: "687 days",
      moons: 2,
      description: "The Red Planet, home to the tallest volcano and deepest canyon in the solar system."
    }
  },
  {
    name: "Jupiter",
    radius: 3.5,
    distance: 40,
    speed: 0.004,
    rotationSpeed: 0.01,
    tilt: 3.1,
    textureFile: "jupiter.jpg",
    color: "#c88b3a",
    moons: [],
    facts: {
      diameter: "139,820 km",
      distanceFromSun: "778.5 million km",
      orbitalPeriod: "11.86 years",
      moons: 95,
      description: "The largest planet, a gas giant with the iconic Great Red Spot storm raging for centuries."
    }
  },
  {
    name: "Saturn",
    radius: 2.9,
    distance: 55,
    speed: 0.003,
    rotationSpeed: 0.009,
    tilt: 26.7,
    textureFile: "saturn.jpg",
    color: "#e8d5a3",
    moons: [],
    facts: {
      diameter: "116,460 km",
      distanceFromSun: "1.43 billion km",
      orbitalPeriod: "29.46 years",
      moons: 146,
      description: "Famous for its stunning ring system made of ice and rock particles orbiting the planet."
    }
  },
  {
    name: "Uranus",
    radius: 1.8,
    distance: 70,
    speed: 0.002,
    rotationSpeed: 0.006,
    tilt: 97.8,
    textureFile: "uranus.jpg",
    color: "#7de8e8",
    moons: [],
    facts: {
      diameter: "50,724 km",
      distanceFromSun: "2.87 billion km",
      orbitalPeriod: "84.01 years",
      moons: 28,
      description: "An ice giant that rotates on its side, likely knocked over by a massive collision long ago."
    }
  },
  {
    name: "Neptune",
    radius: 1.7,
    distance: 85,
    speed: 0.001,
    rotationSpeed: 0.005,
    tilt: 28.3,
    textureFile: "neptune.jpg",
    color: "#3f51b5",
    moons: [],
    facts: {
      diameter: "49,244 km",
      distanceFromSun: "4.5 billion km",
      orbitalPeriod: "164.8 years",
      moons: 16,
      description: "The windiest planet with supersonic storms, and the farthest planet from the Sun."
    }
  }
]

// Static preload — call at module level, not inside a component body
// Moon textures are nested in moons[] so flatMap is required — a plain .map() skips them entirely
// saturn_ring.png added manually — it is not in the planets array
useTexture.preload([
  ...planets.map(p => `/textures/${p.textureFile}`),
  ...planets.flatMap(p => (p.moons || []).map(m => `/textures/${m.textureFile}`)),
  '/textures/saturn_ring.png'
])

export default planets
