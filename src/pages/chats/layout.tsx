import HeaderChats from '@/components/chats/HeaderChats'
import styles from './chats.module.scss'
import ShowChats from "@/components/chats/ShowChats"
import { Route, Router } from '@/components/router'
import ChatsPage from './page'
import ChatPage from './[id]/page'

export default function ChatsLayout() {
  console.log('Chats layout')
  return (
    <section className={styles.chats}>
      <div className={styles['chats-container']}>
        <HeaderChats />

        <ShowChats />
      </div>

      <Router rootPath='/chats'>
        <Route path='' component={ChatsPage} />
        <Route path='/:id' component={ChatPage} />
      </Router>
    </section>
  )
}