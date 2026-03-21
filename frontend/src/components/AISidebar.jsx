import { useState, useEffect, useRef } from 'react'
import useGroqChat from '../hooks/useGroqChat'

export default function AISidebar({ planet }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const { messages, loading, sendMessage, clearMessages } = useGroqChat(planet?.name)

  // Clear messages when planet changes
  useEffect(() => {
    clearMessages()
  }, [planet?.name, clearMessages])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!planet) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white flex flex-col" style={{ maxHeight: '400px' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          Ask about {planet.name}
        </h3>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0 pr-1">
        {messages.length === 0 && (
          <p className="text-white/40 text-sm text-center py-4">
            Ask anything about {planet.name}...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm rounded-lg px-3 py-2 ${
              msg.role === 'user'
                ? 'bg-blue-500/20 text-blue-100 ml-4'
                : 'bg-white/10 text-white/90 mr-4'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-white/10 text-white/60 text-sm rounded-lg px-3 py-2 mr-4">
            <span className="animate-pulse">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          disabled={loading}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/30 rounded-lg px-3 py-2 text-sm text-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}
