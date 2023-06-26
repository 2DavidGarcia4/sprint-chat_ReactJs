import { createContext, useContext, Dispatch, SetStateAction, HTMLInputTypeAttribute } from 'react'

interface Notification {
  type: 'success' | 'error' | 'info' | 'warning'
  text: string
  time?: number
}