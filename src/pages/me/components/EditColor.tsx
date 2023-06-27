import styles from '../me.module.scss'

import { useRef, useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { BsX } from 'react-icons/bs'
import { useUser } from '@/hooks'
import { customFetch } from '@/utils/services'

const defaultColor = '#858585'

export default function EditColor({color, updatedColor, setupdatedColor, setShow}: {
  color?: string
  updatedColor: string
  setupdatedColor: Dispatch<SetStateAction<string>>
  setShow: Dispatch<SetStateAction<boolean>>
}){
  const [change, setChange] = useState(false)
  const editColorRef = useRef<HTMLDivElement>(null)
  const { user, setUser } = useUser()

  useEffect(()=> {
    if(editColorRef.current){
      setTimeout(()=> {
        editColorRef.current?.classList.add(styles.show)
      }, 100)
    }
  }, [])

  const closeEditColor = () => {
    setupdatedColor('')
    if(editColorRef.current){
      editColorRef.current.classList.remove(styles.show)
    }

    setTimeout(()=> {
      setShow(false)
    }, 500)
  }

  const saveChanges = () => {
    if(user) customFetch(`users/${user.id}`, 'PATCH', {color: updatedColor}).then(res=> {
      if(res.id){
        setUser(res)
        closeEditColor()
        // createNotification({
        //   type: 'success',
        //   content: 'Updated name'
        // })
      }
    }).catch(()=> {
      console.error('Error in update user color')
      // createNotification({
      //   type: 'error',
      //   content: 'Error updating name'
      // })
    })
      
  }

  const handlerChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
    setupdatedColor(value)
    if((color || defaultColor) != value && (color || defaultColor) != updatedColor){
      setChange(true)

    }else{
      setChange(false)
    }
  }
  
  return (
    <div ref={editColorRef} className={styles.editColor}>
      <div className={styles['editColor-close']} onClick={closeEditColor}>
        <BsX className={styles['editColor-close-icon']} />
      </div>

      <h4 className={styles['editColor-title']}>Editar color</h4>

      <div className={styles['editColor_section']}>
        <p className={styles['editColor_section-title']}>Color:</p>
        <p>{color || updatedColor || defaultColor}</p>
      </div>

      <div className={styles['editColor_section']}>
        <input onChange={handlerChange} type="color" defaultValue={color || defaultColor} />
        {change && <button className={styles['editColor-button']} onClick={saveChanges} >Guardar</button>}
      </div>
    </div>
  )
}