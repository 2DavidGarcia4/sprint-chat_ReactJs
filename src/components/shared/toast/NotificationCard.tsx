import styles from './notifications.module.scss'

import { useEffect, useRef } from 'react'
import { Notification } from '@/contexts'
import { useNotifications } from '@/hooks'
import { BsX } from 'react-icons/bs'
import { FcInfo } from 'react-icons/fc'

const EMOJI_NOTIFICATION = {
  info: <FcInfo />,
  success: '✅',
  error: '❌',
  warning: '⚠️'
}

export default function NotificationCard({notification}: {notification: Notification}){
  const { deleteNotification } = useNotifications()
  const notificationRef = useRef<HTMLLIElement>(null)

  const hadnleDelete = () => {
    if(notificationRef.current) notificationRef.current.classList.toggle(styles.hide)

    setTimeout(()=> {
      deleteNotification(notification.id)
    }, 800)
  }

  useEffect(()=> {
    if(notification.time){
      setTimeout(()=> {
        hadnleDelete()
      }, notification.time*1000)
    }
  }, [])

  const handleClick = () => {
    hadnleDelete()
  }

  return (
    <li ref={notificationRef} className={styles.notification}>
      <div className={styles['notification-content']}>
        <p>{EMOJI_NOTIFICATION[notification.type]}</p>
        <strong>{notification.content}</strong>
      </div>
      <button onClick={handleClick}>
        <BsX  />       
      </button>
      {notification.time != 0 && <div className={`${styles['notification-barr']} ${styles[notification.type]}`} style={{animationDuration: notification.time+'s'}} />}
    </li>
  )
}