import styles from '../friends.module.scss'

import { MouseEvent, Dispatch, SetStateAction } from 'react'
import { User } from "@/utils/types"
import { HiOutlineUser } from 'react-icons/hi'
import { MdRemoveCircleOutline } from 'react-icons/md'
import  { useTooltip } from '@/hooks/useTooltip'
import CircleStatus from '@/components/status/CircleStatus'
import { customFetch, navigate } from '@/utils/services'
import { useUser } from '@/hooks'
import { socket } from '@/utils/socket'

export default function FriendCard({friend, setFriends}: {
  friend: User,
  setFriends: Dispatch<SetStateAction<User[]>>
}){
  const { events, deleteTooltip } = useTooltip()
  const {setUser} = useUser()

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
      }
    }).catch(()=> console.error('Error in remove friend'))
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