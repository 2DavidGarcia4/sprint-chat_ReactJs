import { type ReactNode } from 'react'
import UserProvider from './userProvider'
import TooltipProvider from './tooltipProvider'
import DynamicPanelProvider from './dynamicPanelProvider'
import NotificationsProvider from './notificationsProvider'

export default function GlobalProviders({children}: {children: ReactNode}){
  return (
    <>
      <TooltipProvider>
        <DynamicPanelProvider>
          <NotificationsProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </NotificationsProvider>
        </DynamicPanelProvider>
      </TooltipProvider>
    </>
  )
}