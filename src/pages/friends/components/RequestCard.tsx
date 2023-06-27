import styles from '../friends.module.scss'

import { useTooltip } from '@/hooks/useTooltip';
import { FriendRequest, User } from "@/utils/types";
import { BsX, BsCheck } from 'react-icons/bs'
import { HiOutlineUser } from 'react-icons/hi'
import { customFetch, transformText } from '@/utils/services';
import { useFriendsCtx } from '@/contexts';
import { useUser } from '@/hooks';
import { socket } from '@/utils/socket';

export default function RequestCard({request, requestType, user}: {
  request: FriendRequest
  requestType: 'sender' | 'receiver'
  user: User,
}){
  const { setRequests } = useFriendsCtx()
  const { setUser } = useUser()
  const { events, deleteTooltip } = useTooltip()
  
  const requestUser = request[requestType]

  const removeRequest = () => {
    deleteTooltip()
    setRequests(r=> r.filter(f=> f.id != request.id))

    socket.emit('friendRequestDelete', request)
  }
  
  const confirmRequest = () => {
    removeRequest()
    customFetch(`friends/add/${requestUser.id}`, 'PATCH').then(res=> {

      if(res.id) {
        setUser(res)
        socket.emit('friendAdd', res)

        customFetch(`friends/requests/${request.id}`, 'DELETE').then((res)=> {
          console.log(res)
        }).catch((e)=> console.error('Error in delete request', e))
      }
    }).catch(()=> console.error('Error in add friend'))
  }

  const cancelRequest = () => {
    removeRequest()
    customFetch(`friends/requests/${request.id}`, 'DELETE').then((res)=> {
      console.log(res)
    }).catch((e)=> console.error('Error in delete request', e))
  }

  return (
    <li className={styles.section_item}>
      <div className={styles['section_item-user']}>
        <div className={styles['section_item-avatar']}>
          {requestUser.avatarUrl ?
            <img src={requestUser.avatarUrl} alt={requestUser.userName} width={36} height={36} /> :
            <HiOutlineUser />
          }
        </div>

        <div className={styles['section_item-info']}>
          <strong>@{requestUser.userName}</strong>
          {requestUser.name && <p>{requestUser.name}</p>}
        </div>
      </div>

      {request.message && <div className={styles['section_item-message']} dangerouslySetInnerHTML={{__html: transformText(request.message)}} />}

      <div className={styles['section_item-buttons']}>
        {requestType == 'sender' && <button className={styles.success} onClick={confirmRequest} {...events} data-direction='top' data-name='Aceptar'>
          <BsCheck />
        </button>}
        <button className={styles.error} onClick={cancelRequest} {...events} data-direction='top' data-name={user.id == request.sender.id ? 'Cancelar' : 'Rechazar'}>
          <BsX />
        </button>
      </div>
    </li>
  )
}