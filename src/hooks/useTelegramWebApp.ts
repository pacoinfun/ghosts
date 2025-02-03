import { useEffect, useState } from 'react'
import type { TelegramWebApp } from '../types/telegram'

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)

  useEffect(() => {
    const tg = window.Telegram.WebApp
    setWebApp(tg)
    
    // Initialize the WebApp
    tg.ready()
    
    // Expand the WebApp to full height
    tg.expand()
    
    // Enable closing confirmation
    tg.enableClosingConfirmation()
    
    // Set the header color
    tg.setHeaderColor('#2481cc')
    
    // Set the background color
    tg.setBackgroundColor('#ffffff')
  }, [])

  return webApp
} 