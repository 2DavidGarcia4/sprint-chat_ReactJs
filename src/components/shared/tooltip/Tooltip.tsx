import styles from './tooltip.module.scss'

import { useEffect, useState, useRef } from 'react'
import { useCtxTooltip } from "@/contexts"
import { setTooltipPosition } from '@/utils/services'

export default function Tooltip(){
  const [thisRef, setThisRef] = useState<HTMLDivElement | null>(null)
  const [ackground, setBackground] = useState(false)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const { tooltip, setTooltip } = useCtxTooltip()

  const minWidth = () => {
    if(typeof window != 'undefined'){
      const { innerWidth } = window
      return innerWidth <= 500
    }else return false
  }

  useEffect(()=> {
    if(tooltip && thisRef){
      setTooltipPosition(tooltip, thisRef)
      if(tooltip.options) {
        if(minWidth()){
          setBackground(true)
          backgroundRef.current?.classList.add(styles.show)
        }
      }
    }

  }, [thisRef, tooltip])

  const closeTooltipOptions = () => {
    if(minWidth()){
      backgroundRef.current?.classList.remove(styles.show)
      setTimeout(()=> {
        setTooltip(undefined)
        setBackground(false)
      }, 500)

    }else setTooltip(undefined)
  }

  const tooltipElement = tooltip && (
    <div ref={setThisRef} {...{onClick: minWidth() ? undefined : closeTooltipOptions}} className={`${styles.tooltip} ${tooltip.options ? styles.options : ''} ${styles[tooltip.direction || 'top']} tlp`} >
      <div className={styles['tooltip-arrow']} />
      {tooltip.options ?
        tooltip.options.map(o=> <li key={o.name} className={styles['tooltip-option']} onClick={o.function} >
          {typeof o.icon == 'string' ? 
            <p>{o.icon}</p> :
            <div className={styles['tooltip-option-icon']}>{o.icon}</div>
          }
          <p>{o.name}</p> 
        </li>) :
        <p>{tooltip.content}</p>
      }
    </div>
  )

  return (
    <>
      {ackground ? 
        <div ref={backgroundRef} className={styles.background} onClick={closeTooltipOptions}>
          {tooltipElement}
        </div> :
        tooltipElement
      }
    </>
  )
}