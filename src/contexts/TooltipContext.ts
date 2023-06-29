import { createContext, type Dispatch, type SetStateAction } from 'react'

export interface TooltipOption {
  icon: string | JSX.Element,
  name: string,
  function: ()=> any
}

export interface Tooltip {
  rect: DOMRect
  content: string
  direction: 'top' | 'left' | 'bottom' | 'right',
  options?: TooltipOption[]
}

export interface TooltipContextTs {
  tooltip: Tooltip | undefined
  setTooltip: Dispatch<SetStateAction<Tooltip | undefined>>
}

export const TooltipContext = createContext<TooltipContextTs | undefined>(undefined)