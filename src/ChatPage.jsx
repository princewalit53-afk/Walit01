import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const roomId = 'public-room'

  useEffect(() => {
    fetchMessages()
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (newMessage.trim() === '') return
    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: 'user1',
      text: newMessage
    })
    setNewMessage('')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dakin Tattaunawa</h2>
      <div style={{ border: '1px solid gray', height: 400, overflowY: 'scroll', padding: 10 }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.sender_id}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Rubuta sako..."
        style={{ width: '70%' }}
      />
      <button onClick={sendMessage}>Aika</button>
    </div>
  )
}
