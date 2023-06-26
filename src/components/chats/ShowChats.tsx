'use client'

import styles from './showChats.module.scss'

import { useEffect, useState } from 'react'
import { HiOutlineUser, HiOutlineUsers } from 'react-icons/hi'
import ChatCard from './ChatCard'
import { Chat } from '@/utils/types'
import HeaderChats from './HeaderChats'
import { customFetch } from '@/utils/services'

const chats: Chat[] = [
  {
    id: '1',
    name: null,
    type: 0,
    ownerId: 'asdqwe',
    iconUrl: null,
    description: null,
    lastMessageId: null,
    createdAt: new Date(),
    updatedAt: new Date() 
  },
  {
    id: '2',
    name: 'devs',
    type: 1,
    ownerId: '23132sad',
    iconUrl: null,
    description: null,
    lastMessageId: null,
    createdAt: new Date(),
    updatedAt: new Date() 
  },
]

export default function ShowChats(){
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(()=> {
    customFetch('chats').then(res=> {
      // console.log(res)
      if(res.length) setChats(res)
      
    }).catch(()=> console.log('Error in get chats'))
  }, [])

  return (
    <ul className={styles.chats}>
      {chats.sort((a, b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(chat=> <ChatCard key={chat.id} chat={chat} />)}
    </ul>
  )
}