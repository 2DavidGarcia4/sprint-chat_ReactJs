import { useContext } from 'react'
import { useTooltip } from '.'
import { navigate } from '@/utils/services'
import { UserContext, type UserContextTs } from '@/contexts'

export function useUser() {
  const { user, setUser } = useContext(UserContext) as UserContextTs
  const { deleteTooltip } = useTooltip()
  const isLoged = Boolean(user)

  const protectedRoute = () => {
    if(!isLoged) {
      navigate('/login')
      deleteTooltip()
    }
  }


  return {
    user, 
    setUser,
    isLoged,
    protectedRoute,    
  }
}