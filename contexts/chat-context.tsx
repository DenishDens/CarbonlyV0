"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

type ChatContextType = {
  isOpen: boolean
  toggleChat: () => void
  messages: Message[]
  addMessage: (message: Message) => void
  userName: string | null
  setUserName: (name: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [userName, setUserName] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
  }

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  // Only provide the context value if the component has mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        toggleChat,
        messages,
        addMessage,
        userName,
        setUserName,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    // Return a dummy implementation instead of throwing an error
    return {
      isOpen: false,
      toggleChat: () => {},
      messages: [],
      addMessage: () => {},
      userName: null,
      setUserName: () => {},
    }
  }
  return context
}

