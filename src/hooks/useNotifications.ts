import { useContext } from 'react'
import { NotificationContext } from '@/contexts'

export function useNotifications() {
  return useContext(NotificationContext)
}