import { createContext, useContext, Dispatch, SetStateAction } from 'react'

interface MeContext {
  userId?: string
  valid?: boolean
  setValid: Dispatch<SetStateAction<boolean | undefined>>
  showValidator: boolean
  setShowValidator: Dispatch<SetStateAction<boolean>>
}

export const MeContext = createContext<MeContext | undefined>(undefined)
export function useMeCtx() {
  return useContext(MeContext) as MeContext
}