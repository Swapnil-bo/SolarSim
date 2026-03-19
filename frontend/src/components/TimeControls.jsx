export default function TimeControls({ timeScale, setTimeScale, isPaused, setIsPaused }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white select-none">
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-sm font-bold"
      >
        {isPaused ? '\u25B6' : '\u275A\u275A'}
      </button>

      <label className="flex items-center gap-2 text-sm">
        <span className="w-10 text-right">{timeScale.toFixed(1)}x</span>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={timeScale}
          onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          className="w-32 accent-white"
        />
      </label>

      <button
        onClick={() => setTimeScale(1)}
        className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-sm"
      >
        Reset
      </button>
    </div>
  )
}
