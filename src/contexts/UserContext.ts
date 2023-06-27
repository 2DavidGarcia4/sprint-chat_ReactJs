import { createContext, Dispatch, SetStateAction } from 'react'
import { User } from "../utils/types"

export interface UserContextTs {
  user: User | undefined
  setUser: Dispatch<SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserContextTs | undefined>(undefined)