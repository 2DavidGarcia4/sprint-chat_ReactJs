import { createContext, useContext, Dispatch, SetStateAction } from 'react'
import { User } from "../utils/types"

interface UserContext {
  user: User | undefined, setUser: Dispatch<SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserContext | undefined>(undefined)
export function useCtxUser() {
  return useContext(UserContext) as UserContext
}