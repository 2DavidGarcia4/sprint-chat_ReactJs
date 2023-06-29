import styles from './friends.module.scss'

import { useState, useEffect } from 'react'
import { socket } from '@/utils/socket';
import { FriendsContext } from '@/contexts';
import { customFetch } from '@/utils/services';
import type { FriendRequest } from '@/utils/types';
import { useNotifications, useUser } from '@/hooks';
import AddFriend from './components/AddFriend';
import FriendsList from './components/FriendsList';
import RequestsList from './components/RequestList';
import HeaderFriends from "./components/HeaderFriends";

export default function Friends(){
  const { user } = useUser()
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [activationIndex, setActivationIndex] = useState(0)
  const { createNotification } = useNotifications()

  useEffect(()=> {
    customFetch('friends/requests').then((res: FriendRequest[])=> {
      // console.log(res)

      if(res.length) setRequests(res)
    }).catch(()=> console.error('Error in get requests'))

    const handleFriendRequestCreate = (newRequest: FriendRequest) => {
      if(newRequest.receiver.id == user?.id) {
        setRequests(r=> [...r, newRequest])
        createNotification({
          type: 'info',
          content: `Solicitud de amistad entrante de ${newRequest.sender.userName}`
        })
      }
    }
    
    const handleFriendRequestDelete = (oldRequest: FriendRequest) => {
      
      if(oldRequest.sender.id == user?.id || oldRequest.receiver.id == user?.id) {
        setRequests(r=> r.filter(f=> f.id != oldRequest.id))
        console.log(user.friends, user.friends.some(s=> s == oldRequest.sender.id))

        if(oldRequest.sender.id != user?.id){
          createNotification({
            type: 'info',
            mute: true,
            time: 10,
            content: `Solicitud de amistad de ${oldRequest.sender.userName} eliminada`
          })
        }

        if(oldRequest.receiver.id != user?.id){
          createNotification({
            type: 'info',
            mute: true,
            time: 10,
            content: `${oldRequest.receiver.userName} ha rechazado tu solicitud de amistad`
          })
        }
      }
    }

    socket.on('friendRequestCreate', handleFriendRequestCreate)
    socket.on('friendRequestDelete', handleFriendRequestDelete)

    return ()=> {
      socket.off('friendRequestCreate', handleFriendRequestCreate)
      socket.off('friendRequestDelete', handleFriendRequestDelete)
    }
  }, [user])

  return (
    <section className={styles.friends}>
      <HeaderFriends {...{activationIndex, setActivationIndex}} requests={requests.filter(f=> f.receiver.id == user?.id).length} />
      
      <div className={styles['friends-content']}>
        <FriendsContext.Provider value={{requests, setRequests}}>
          {(activationIndex == 0 && user) && <FriendsList {...{user}} />}
          {(activationIndex == 1 && user) && <AddFriend {...{user}} />}
          {(activationIndex == 2 && user) && <RequestsList {...{user}} />}
        </FriendsContext.Provider>
      </div>
    </section>
  )
}