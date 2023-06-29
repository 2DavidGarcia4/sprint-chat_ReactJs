import styles from '../me.module.scss'

import { useRef, useState, useEffect, type MouseEvent, type ReactNode } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

export default function Option({children, head}: {children: ReactNode, head: ReactNode}){
  const containerRef = useRef<HTMLDivElement>(null)
  const [elementsRef, setElementsRef] = useState<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(()=> {
    const options: MutationObserverInit = {
      childList: true,
      subtree: true
    }
    
    if(containerRef.current){
      const observer = new MutationObserver((mutations)=> {
        mutations.forEach((mutation)=> {
          if(mutation.type === 'childList') {
            if(containerRef.current && elementsRef){
              containerRef.current.style.height = open ? elementsRef.clientHeight + 'px' : ''
            }
            // console.log('Un componente HTML ha aparecido o desaparecido')
          }
        })
      })

      observer.observe(containerRef.current, options)

      return ()=> {
        observer.disconnect()
      }
    }
  }, [elementsRef, open])

  const toggleOption = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.parentElement?.classList.toggle(styles.open)
    setOpen(o=> !o)
  }

  return (
    <div className={styles['me_profile_option']}>
      <div className={styles['me_profile_option-head']} onClick={toggleOption}>
        {head}
        <IoIosArrowForward className={styles['me_profile_option-arrow']} />
      </div>
      <div ref={containerRef} className={styles['me_profile_option-content']} style={{height: open ? elementsRef?.clientHeight + 'px' : ''}} >
        <div ref={setElementsRef} className={styles['me_profile_option-elements']}>
          {children}
        </div>
      </div>
    </div>
  )
}