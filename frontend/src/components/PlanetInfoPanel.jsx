export default function PlanetInfoPanel({ planet, onClose }) {
  if (!planet) return null

  const { facts } = planet

  return (
    <div className="relative w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 text-white transition-all">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors text-sm"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-3">{planet.name}</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Diameter</span>
          <span>{facts.diameter}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Distance from Sun</span>
          <span>{facts.distanceFromSun}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Orbital Period</span>
          <span>{facts.orbitalPeriod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Moons</span>
          <span>{facts.moons}</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-white/80 leading-relaxed">
        {facts.description}
      </p>
    </div>
  )
}
