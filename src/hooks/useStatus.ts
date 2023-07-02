import { useEffect } from 'react'
import { useUser } from "."
import { customFetch } from "@/utils/services"
import { STORAGE_KEYS } from '@/utils/data'

export function useStatus() {
  const { user, setUser } = useUser()
  
  useEffect(()=> {
    const defaultStatus = parseInt(localStorage.getItem(STORAGE_KEYS.STATUS) || '1')

    if(defaultStatus != 0 && user?.status?.type == 0){
      customFetch(`users/@me/status`, 'PATCH', {type: defaultStatus}).then(res=> {
        if(res.id){
          setUser(res)
        }
      }).catch(()=> console.error('Error in update status'))
    }
    
    if(user?.status && [0, 2].every(s=> defaultStatus != s)){
      const cooldown = 6*60000
      const { type } = user.status
      let activeTime = Date.now()
  
      const active = () => {
        const now = Date.now()
        
        if(activeTime+1000 < now) {
          activeTime = now
          
          if(type != defaultStatus){
            customFetch(`users/@me/status`, 'PATCH', {type: defaultStatus}).then(res=> {
              if(res.id){
                setUser(res)
              }
            }).catch(()=> console.error('Error in update status'))
            // console.log('activate', {type})
          }
        }
      }
  
      const interval = setInterval(()=> {
        const now = Date.now()
  
        if(activeTime+cooldown < now && type != 2){
          customFetch(`users/@me/status`, 'PATCH', {type: 2}).then(res=> {
            if(res.id){
              setUser(res)
            }
          }).catch(()=> console.error('Error in update status'))
          // console.log('inactivate', {type})
        }
      }, 2000)
  
      document.addEventListener('mousemove', active)
      
      return () => {
        clearInterval(interval)
        document.removeEventListener('mousemove', active)
      }

    }
  }, [user])
}