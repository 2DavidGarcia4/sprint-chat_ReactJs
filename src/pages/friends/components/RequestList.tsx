import styles from '../friends.module.scss'

import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { FriendRequest, User } from '@/utils/types'
import RequestCard from './RequestCard'
import { useFriendsCtx } from '@/contexts'
import ItemsList from './ItemsList'

export default function RequestsList({user}: {
  user: User
}){
  const { requests } = useFriendsCtx()
  const [requestsTypes, setRequestsTypes] = useState<{senders: FriendRequest[], receivers: FriendRequest[]}>({
    senders: [],
    receivers: []
  })

  useEffect(()=> {
    setRequestsTypes({
      senders: requests.filter(f=> f.sender.id == user.id),
      receivers: requests.filter(f=> f.receiver.id == user.id),
    })
  }, [requests])


  return (
    <div className={styles.section}>
      <h4>Tus solicitudes de amistad</h4>

      {(!requestsTypes.receivers.length && !requestsTypes.senders.length) &&
        <div className={styles['addFriend-texts']}>
          <p>!No tienes solicitudes de amistad¡</p>
        </div>
      }

      {Boolean(requestsTypes.receivers.length) && 
        <ItemsList title='Recibida' items={requestsTypes.receivers.length} >
          {requestsTypes.receivers.map(r=> <RequestCard key={r.id} request={r} requestType='sender' {...{user}} />)}
        </ItemsList>
      }

      {Boolean(requestsTypes.senders.length) && 
        <ItemsList title='Enviada' items={requestsTypes.senders.length} >
          {requestsTypes.senders.map(s=> <RequestCard key={s.id} request={s} requestType='receiver' {...{user}} />)}
        </ItemsList>
      } 
    </div>
  )
}