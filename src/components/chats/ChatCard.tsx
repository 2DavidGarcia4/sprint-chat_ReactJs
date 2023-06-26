'use client'

import styles from './showChats.module.scss'

import { useEffect, useState } from 'react'
import { Link } from '../router';
import { Chat, User } from "@/utils/types";
import { HiOutlineUser, HiOutlineUsers } from 'react-icons/hi'

export default function ChatCard({chat}: {chat: Chat}){
  const [members, setMembers] = useState<User | undefined>()

  useEffect(()=> {
    // if(chat.type == 0){
    //   fetch(`${endPoint}chats/${chat.id}`).then(res=> {
    //     console.log(res)
    //   }).catch(()=> '')

    // }
  }, [])

  return (
    <li className={styles.chats_card}>
      <Link href={`/chats/${chat.id}`} className={styles['chats_card-link']} >
        <div className={styles['chats_card-icon']}>
          {chat.iconUrl ? 
            <img className={styles['chats_card-icon-img']} src={chat.iconUrl} alt={chat.name || 'chat'} width={40} height={40} /> :
            (chat.type == 0 ?
              <HiOutlineUser className={styles['chats_card-icon-default']} /> :
              <HiOutlineUsers className={styles['chats_card-icon-default']} />
            )
          }  
        </div>
        
        <div className={styles['chats_card-content']}>
          <strong className={styles['chats_card-title']}>{chat.name}</strong>

        </div>
      </Link>
    </li>
  )
}