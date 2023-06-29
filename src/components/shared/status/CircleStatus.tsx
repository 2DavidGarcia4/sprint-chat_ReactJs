import styles from './status.module.scss'

import { useRef, useEffect } from 'react'
import { UserStatus } from '@/utils/types'
import { STATUS_NAMES } from '@/utils/data'
import { useTooltip } from '@/hooks/useTooltip'
import { Tooltip } from '@/contexts'

const STATUS_TYPES = {
  '0': 'offline',
  '1': 'online',
  '2': 'idle',
  '3': 'dnd',
  '4': 'say'
}

export default function CircleStatus({status, size, tooltip}: {
  status: UserStatus, 
  size?: number,
  tooltip?: {
    direction: Tooltip['direction']
  }
}){
  const thisRef = useRef<HTMLDivElement>(null)
  const { events } = useTooltip()

  useEffect(() => {
    const size = thisRef.current?.parentElement?.clientWidth

    if(size){
      let a = Math.sqrt(2 * size * size)
      let b = a / 2
      let c = b - (size / 2)
      let res = Math.sqrt(c * c / 2)
      
      thisRef.current.style.bottom = `${res}px`
      thisRef.current.style.right = `${res}px`
    }
  }, [])

  return (
    <div ref={thisRef} className={`${styles.circle} ${styles[STATUS_TYPES[status.type]]}`} style={size ? {
      width: `${size}px`, 
      height: `${size}px`, 
      borderWidth: `${Math.floor(size/8)}px`
    } : undefined} {...(tooltip?.direction ? events : {})} data-direction={tooltip?.direction || ''} data-name={tooltip?.direction ? STATUS_NAMES[status.type] : ''} >

    </div>
  )
}