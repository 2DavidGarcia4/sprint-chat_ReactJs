import { MouseEvent } from 'react'
import { navigate } from "../../utils/services"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  target?: React.HTMLAttributeAnchorTarget
}

export function Link({href, target, ...props}: LinkProps){
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    
    const isMainEvent = event.button == 0
    const isModifiedEvent = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
    const isManageableEvent = target == undefined || target == '_self'
    
    if(isMainEvent && isManageableEvent && !isModifiedEvent){
      event.preventDefault()
      navigate(href)
    }
  }

  return (
    <a href={href} target={target} {...props} onClick={handleClick} />
  )
}