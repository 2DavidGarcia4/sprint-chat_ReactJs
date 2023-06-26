import { useCtxUser } from '@/contexts'
import { navigate } from '@/utils/services'

export function useUser() {
  const { user } = useCtxUser()

  const isLoged = Boolean(user)

  const protectedRoute = () => {
    if(!user) {
      navigate('/login')
    }
  }

  return {
    isLoged,
    protectedRoute
  }
}