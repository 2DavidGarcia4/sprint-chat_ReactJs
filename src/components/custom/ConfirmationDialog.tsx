import styles from './confirmationDialog.module.scss'

import { useEffect, useRef, MouseEvent } from 'react'

export default function ConfirmationDialog({title, description, type, onConfirm, onCancel}: {
  title: string,
  description?: string, 
  type?: 'danger' | 'success',
  onConfirm: ()=> void,
  onCancel: ()=> void
}){
  const thisRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const closeDialog = (callback: () => void) => {
    if(thisRef.current){
      thisRef.current.classList.add('hidenDialog')
    }

    setTimeout(()=> {
      callback()
    }, 500)
  }

  useEffect(()=> {
    setTimeout(()=> {
      if(thisRef.current){
        thisRef.current.classList.add('showDialog')
      }
    }, 100)

  }, [])

  const handlerClick = (e: MouseEvent<HTMLDivElement>) => {
    if(dialogRef.current && !dialogRef.current.contains(e.target as Node | null)){
      closeDialog(onCancel)
    }
  }

  return (
    <div ref={thisRef} onClick={handlerClick} className={styles.confirmation}>
      <div ref={dialogRef} className={styles['confirmation_dialog']}>
        <h4 className={styles['confirmation_dialog-title']}>{title}</h4>
        {description && <p className={styles['confirmation_dialog-description']}>{description}</p>}
        
        <div className={styles['confirmation_dialog-buttons']}>
          <button className={`${styles['confirmation_dialog-button']} ${styles[type || 'default']}`} onClick={()=> closeDialog(onConfirm)}>{title}</button>
          <button className={`${styles['confirmation_dialog-button']}`} onClick={()=> closeDialog(onCancel)}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}