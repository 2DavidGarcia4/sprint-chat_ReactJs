import { useState, type ReactNode } from 'react'
import { TooltipContext, TooltipContextTs } from "../contexts"

export default function TooltipProvider({ children }: { children: ReactNode }){
  const [tooltip, setTooltip] = useState<TooltipContextTs['tooltip']>()

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
    </TooltipContext.Provider>
  )
}