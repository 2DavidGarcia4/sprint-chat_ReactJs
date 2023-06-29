import { useState, useEffect, type ReactNode } from "react"
import { socket } from "@/utils/socket"
import type { User } from "@/utils/types"
import { UserContext } from "@/contexts"
import { useNotifications } from "@/hooks"
import { customFetch } from "@/utils/services"

export default function UserProvider({ children }: { children: ReactNode }){
  const [user, setUser] = useState<User | undefined>(undefined)
  const { createNotification } = useNotifications()

  useEffect(()=> {
    if(!user){
      customFetch(`users/@me`).then(res=> {
        if(res.id) {
          setUser(res)
          createNotification({
            time: 10,
            type: 'info',
            content: 'Datos cargados',
          })
        }
      })
      .catch(()=> '')

    }else{
      // console.log('Emit userUpdate event')
      socket.emit('userUpdate', user)
    }

    const handleAddFriend = (friend: User) => {
      if(user && friend.friends.some(s=> s == user.id) && user.friends.every(e=> e != friend.id)){
        const updatedUser = {...user, friends: [...user.friends, friend.id]}
        setUser(updatedUser)
        createNotification({
          type: 'info',
          time: 10,
          content: `${friend.userName} ahora es tu amig@`
        })
      }
    }

    const handleRemoveFriend = (friend: User) => {
      if(user && user.friends.some(s=> s == friend.id)){
        const updatedUser = {...user, friends: user.friends.filter(f=> f != friend.id)}
        setUser(updatedUser)
        createNotification({
          type: 'info',
          time: 10,
          content: `${friend.userName} te ha eliminado de sus amigos`
        })
      }
    }

    socket.on('friendAdd', handleAddFriend)
    socket.on('friendRemove', handleRemoveFriend)
    
    return ()=> {
      socket.off('friendAdd', handleAddFriend)
      socket.off('friendRemove', handleRemoveFriend)
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  )
}