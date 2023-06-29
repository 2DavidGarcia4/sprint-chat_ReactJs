import { useState, useEffect, type ReactNode } from 'react'
import { NotificationContext, type Notification } from '@/contexts'

export default function NotificationsProvider({children}: {children: ReactNode}){
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(()=> {

  }, [])

  const deleteNotification = (id: string) => {
    setNotifications(ns=> ns.filter(f=> f.id != id))
  }

  const createNotification = (data: (Omit<Notification, 'id' | 'time'> & {
    time?: number,
    mute?: boolean
  })) => {
    const id = crypto.randomUUID()
    const defaultTime = 8
    const time = data.time != undefined ? data.time : defaultTime

    setNotifications(ns=> [...ns, {
      id, 
      ...data,
      time
    }])

    if(!data.mute){
      const sound = new Audio('/sounds/notification.wav')
      if(sound){
        sound.volume = 0.6
        sound.play()
      }
    }

    if(time != 0){
      setTimeout(()=> {
        deleteNotification(id)
      }, (time*1000)+800)
    }
  }

  
  
  return (
    <NotificationContext.Provider value={{notifications, deleteNotification, createNotification}}>
      {children}
    </NotificationContext.Provider>
  )
}