import styles from '../friends.module.scss'

import { type MouseEvent, type Dispatch, type SetStateAction } from 'react'
import { User } from "@/utils/types"
import { socket } from '@/utils/socket'
import { useTooltip } from '@/hooks/useTooltip'
import { customFetch, navigate } from '@/utils/services'
import { useNotifications, useUser } from '@/hooks'
import CircleStatus from '@/components/shared/status/CircleStatus'
import { HiOutlineUser } from 'react-icons/hi'
import { MdRemoveCircleOutline } from 'react-icons/md'

export default function FriendCard({friend, setFriends}: {
  friend: User,
  setFriends: Dispatch<SetStateAction<User[]>>
}){
  const { events, deleteTooltip } = useTooltip()
  const { setUser } = useUser()
  const { createNotification } = useNotifications()

  const openChatFriend = () => {
    customFetch(`chats/friend/${friend.id}`).then(res=> {
      
      if(res.id){
        navigate(`/chats/${res.id}`)

      }else{
        customFetch('chats', 'POST', {
          type: 0
        }).then(chat=> {

          if(chat.id){
            navigate(`/chats/${chat.id}`)
          }
        }).catch(()=> console.error('Error in create chat by friend'))
      }
    }).catch((e)=> console.error('Error in get chat by friend', e))
  }

  const removeFriend = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteTooltip()
    
    customFetch(`friends/remove/${friend.id}`, 'PATCH').then(res=> {
      if(res.id) {
        setUser(res)
        socket.emit('friendRemove', res)
        setFriends(f=> f.filter(f=> f.id != friend.id))
        createNotification({
          type: 'info',
          mute: true,
          content: `Has eliminado a ${friend.userName} de tus amigos`
        })
      }
    }).catch(()=> {
      console.error('Error in remove friend')
      createNotification({
        type: 'error',
        mute: true,
        content: `No se ha podido eliminar a ${friend.userName} de tus amigos`
      })
    })
  }

  return (
    <li onClick={openChatFriend} className={`${styles.section_item} ${styles.section_friend}`}>
      <div className={styles['section_item-avatar']}>
        {friend.avatarUrl ?
          <img src={friend.avatarUrl} alt={friend.userName} width={36} height={36} /> :
          <HiOutlineUser />
        }
        {friend.status && <CircleStatus status={friend.status} tooltip={{direction: 'top'}} />}
      </div>

      <div className={styles['section_item-info']}>
        <strong>@{friend.userName}</strong>
        {friend.name && <p>{friend.name}</p>}
      </div>

      <div className={styles['section_item-buttons']}>
        <button className={styles.error} onClick={removeFriend} {...events} data-direction='top' data-name='Eliminar amigo'>
          <MdRemoveCircleOutline />
        </button>
      </div>
    </li>
  )
}