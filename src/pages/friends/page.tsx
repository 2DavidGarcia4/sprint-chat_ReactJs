'use client'

import styles from './friends.module.scss'

import { useState, useEffect } from 'react'
import HeaderFriends from "./components/HeaderFriends";
import FriendsList from './components/FriendsList';
import AddFriend from './components/AddFriend';
import RequestsList from './components/RequestList';
import { FriendsContext, useCtxUser } from '@/contexts';
import { FriendRequest } from '@/utils/types';
import { customFetch } from '@/utils/services';
import { socket } from '@/utils/socket';
import HandleStatus from '@/components/autostatus/HandleStatus';

export default function Friends(){
  const { user } = useCtxUser()
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [activationIndex, setActivationIndex] = useState(0)

  useEffect(()=> {
    customFetch('friends/requests').then((res: FriendRequest[])=> {
      // console.log(res)

      if(res.length) setRequests(res)
    }).catch(()=> console.error('Error in get requests'))

    const handleFriendRequestCreate = (newRequest: FriendRequest) => {
      if(newRequest.receiver.id == user?.id) {
        setRequests(r=> [...r, newRequest])
      }
    }
    
    const handleFriendRequestDelete = (oldRequest: FriendRequest) => {
      if(oldRequest.sender.id == user?.id || oldRequest.receiver.id == user?.id) {
        setRequests(r=> r.filter(f=> f.id != oldRequest.id))
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
      <HandleStatus />
    </section>
  )
}