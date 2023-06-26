'use client'

import { useEffect } from 'react'
import { useCtxUser } from '@/contexts'
import { socket } from '@/utils/socket'

export default function HandleStatus(){
  const { user, setUser } = useCtxUser()
  
  useEffect(()=> {
    
    if(typeof document != 'undefined'){
      const cooldown = 20000
      let userStatu = 0
      let activeTime = Date.now()

      const active = () => {
        const now = Date.now()
        if(activeTime+1000 < now && userStatu != 0){
          activeTime = now
          userStatu = 0
          console.log('activate', {userStatu})
        }
      }

      const interval = setInterval(()=> {
        const now = Date.now()

        if(activeTime+cooldown < now && userStatu != 4){
          userStatu = 4
          console.log('inactivate', {userStatu})
        }
      }, 2000)

      document.addEventListener('mousemove', active)
      
      return () => {
        clearInterval(interval)
        document.removeEventListener('mousemove', active)
      }
    }
    

  }, [])
  
  return (
    <>
    </>
  )
}