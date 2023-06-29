import { createContext } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  time: number
  content: string
}

interface NotificationContext {
  notifications: Notification[]
  deleteNotification: (id: string) => void
  createNotification: (data: (Omit<Notification, 'id' | 'time'> & {
    time?: number
    mute?: boolean
  })) => void
}

export const NotificationContext = createContext<NotificationContext>({
  notifications: [],
  deleteNotification(id) {
    id
  },
  createNotification(data) {
    data    
  },
}) 