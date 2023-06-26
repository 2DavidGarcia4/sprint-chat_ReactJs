import { createContext, useContext, Dispatch, SetStateAction } from 'react'
import { FriendRequest } from '../utils/types'

interface FriendsContext {
  requests: FriendRequest[]
  setRequests: Dispatch<SetStateAction<FriendRequest[]>>
}

export const FriendsContext = createContext<FriendsContext | undefined>(undefined)
export function useFriendsCtx() {
  return useContext(FriendsContext) as FriendsContext
}