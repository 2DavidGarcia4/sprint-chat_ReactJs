'use client'

import { User } from "../utils/types"
import { useState, useEffect, ReactNode } from "react"
import { UserContext } from "../contexts"
import { customFetch } from "../utils/services"
import { socket } from "../utils/socket"

export default function UserProvider({ children }: { children: ReactNode }){
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(()=> {
    // console.log(user)
    if(!user){
      customFetch(`users/@me`).then(res=> {
        if(res.id) setUser(res)
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
      }
    }

    const handleRemoveFriend = (friend: User) => {
      if(user && user.friends.some(s=> s == friend.id)){
        // console.log({friend})
        const updatedUser = {...user, friends: user.friends.filter(f=> f != friend.id)}
        setUser(updatedUser)
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