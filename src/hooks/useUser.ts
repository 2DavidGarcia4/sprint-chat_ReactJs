import { useContext } from 'react'
import { UserContext, type UserContextTs } from '@/contexts'
import { navigate } from '@/utils/services'

export function useUser() {
  const { user, setUser } = useContext(UserContext) as UserContextTs
  const isLoged = Boolean(user)

  const protectedRoute = () => {
    if(!user) {
      navigate('/login')
    }
  }


  return {
    user, 
    setUser,
    isLoged,
    protectedRoute,    
  }
}