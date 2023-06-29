import styles from '../friends.module.scss'

import { useEffect, useState } from 'react'
import { User } from '@/utils/types'
import { socket } from '@/utils/socket'
import { customFetch } from '@/utils/services'
import ItemsList from './ItemsList'
import FriendCard from './FriendCard'

export default function FriendsList({user}: {user: User}){
  const [friends, setFriends] = useState<User[]>([])
  const [friendsByStatus, setFriendsByStatus] = useState<{
    online: User[],
    offline: User[]
  }>({
    online: [],
    offline: []
  })

  useEffect(()=> {
    if(friends.length || (friendsByStatus.offline.length || friendsByStatus.online.length)){
      setFriendsByStatus({
        online: friends.filter((f: User)=> f.status?.type != 0),
        offline: friends.filter((f: User)=> f.status?.type == 0)
      })

    }else{
      customFetch('friends').then(res=> {
        
        if(res.length) {
          setFriends(res)
        }
      }).catch(()=> console.error('Error in get friends'))
    }

    const handleUserUpdate = (updatedUser: User) => {
      if(friends.some(s=> s.id == updatedUser.id)){
        setFriends(fs=> fs.map(f=> f.id == updatedUser.id ? updatedUser : f))
      }
    }

    socket.on('userUpdate', handleUserUpdate)

    return ()=> {
      socket.off('userUpdate', handleUserUpdate)
    }
  }, [friends])
  
  return (
    <div className={styles.section}>
      <h4>Lista de amigos</h4>

      {(!friendsByStatus.online.length && !friendsByStatus.offline.length) &&
        <div className={styles['addFriend-texts']}>
          <p>!Aun no tienes amigos¡</p>
        </div>
      }

      {Boolean(friendsByStatus.online.length) &&
        <ItemsList title='Conectado' items={friendsByStatus.online.length} >
          {friendsByStatus.online.map(f=> <FriendCard key={f.id} friend={f} {...{user, setFriends}} />)}
        </ItemsList>
      }

      {Boolean(friendsByStatus.offline.length) &&
        <ItemsList title='Desconectado' items={friendsByStatus.offline.length} >
          {friendsByStatus.offline.map(f=> <FriendCard key={f.id} friend={f} {...{user, setFriends}} />)}
        </ItemsList>
      }
    </div>
  )
}