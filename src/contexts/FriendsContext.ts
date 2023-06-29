import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { FriendRequest } from '../utils/types'

interface FriendsContext {
  requests: FriendRequest[]
  setRequests: Dispatch<SetStateAction<FriendRequest[]>>
}

export const FriendsContext = createContext<FriendsContext | undefined>(undefined)
export function useFriendsCtx() {
  return useContext(FriendsContext) as FriendsContext
}