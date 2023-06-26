import { createContext, useContext, useReducer, Dispatch, SetStateAction, ReducerWithoutAction } from 'react'

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

enum ActionType {

}

function tooltipReducer(state: Tooltip | undefined, action: 'CREATE' | 'DELETE'){
  switch (action) {
    case 'CREATE': {
      return state
    } 
  
    default:
      return state
  }
}

export function useCtxTooltip() {
  const [tooltip, dispatch] = useReducer(tooltipReducer, undefined)

  return useContext(TooltipContext) as TooltipContextTs
}