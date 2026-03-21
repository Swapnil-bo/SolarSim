import { useState, useCallback, useRef } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function useGroqChat(planetName) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const historyRef = useRef([])

  const sendMessage = useCallback(async (question) => {
    if (!question.trim() || !planetName) return

    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    // Keep last 4 turns (8 messages) for context
    const history = historyRef.current.slice(-8)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planet: planetName,
          question,
          history,
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      const assistantMsg = { role: 'assistant', content: data.answer }

      setMessages(prev => [...prev, assistantMsg])
      historyRef.current = [...history, userMsg, assistantMsg]
    } catch (err) {
      const errorMsg = { role: 'assistant', content: 'Failed to get a response. Is the backend running?' }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }, [planetName])

  const clearMessages = useCallback(() => {
    setMessages([])
    historyRef.current = []
  }, [])

  return { messages, loading, sendMessage, clearMessages }
}
