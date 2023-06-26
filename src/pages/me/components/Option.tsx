import styles from '../me.module.scss'

import { useRef, useState, MouseEvent, ReactNode } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

export default function Option({children, head}: {children: ReactNode, head: ReactNode}){
  const elementsRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

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
      <div className={styles['me_profile_option-content']} style={{height: open ? elementsRef.current?.clientHeight + 'px' : undefined}} >
        <div ref={elementsRef} className={styles['me_profile_option-elements']}>
          {children}
        </div>
      </div>
    </div>
  )
}