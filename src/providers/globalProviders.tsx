import { ReactNode } from 'react'
import UserProvider from './userProvider'
import TooltipProvider from './tooltipProvider'
import DynamicPanelProvider from './dynamicPanelProvider'

export default function GlobalProviders({children}: {children: ReactNode}){
  return (
    <>
      <TooltipProvider>
        <DynamicPanelProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </DynamicPanelProvider>
      </TooltipProvider>
    </>
  )
}