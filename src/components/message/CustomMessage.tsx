import { useEffect, useState } from 'react'
import styles from './message.module.scss'

import { BiCheck } from 'react-icons/bi'

export default function CustomMessage({content, time}: {content: string, time: number}){
  const [countdown, setCountdown] = useState(time)

  useEffect(()=> {
    let count = time
    let intervalo = setInterval(()=> {
      if(count == 1) clearInterval(intervalo)
      
      count--
      setCountdown(c=> c-1)
    }, 1000)
  }, [])
  
  return (  
    <div className={styles.custom}>
      <p className={styles['custom-content']}>
        <BiCheck className={styles['custom-icon']} /> {content}
      </p>
      <p className={styles['custom-info']}>redirección en: {countdown}</p>
    </div>
  )
}