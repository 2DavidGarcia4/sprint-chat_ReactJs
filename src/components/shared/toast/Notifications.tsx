import styles from './notifications.module.scss'

import { useEffect, useState, useRef } from 'react'
import { useNotifications } from '@/hooks'
import { handleHeight } from '@/utils/services'
import NotificationCard from './NotificationCard'

export default function Notifications(){
  const { notifications } = useNotifications()
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [listRef, setListRef] = useState<HTMLUListElement | null>(null)

  useEffect(()=> {
    handleHeight(notificationsRef.current, listRef, 28)
  }, [notifications, listRef])

  return notifications.length ? (
    <div ref={notificationsRef} className={styles.notifications}>
      <ul ref={setListRef} className={styles['notifications-list']}>
        {notifications.map(n=> <NotificationCard key={n.id} notification={n} />)}
      </ul>
    </div>
  ) : null
}