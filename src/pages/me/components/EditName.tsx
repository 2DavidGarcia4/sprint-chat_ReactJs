import styles from '../me.module.scss'

import { useRef, useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { User } from '@/utils/types'
import { useMeCtx } from '@/contexts'
import { customFetch } from '@/utils/services'
import { useNotifications, useUser } from '@/hooks'
import { FaEdit } from 'react-icons/fa'
import { MdSave } from 'react-icons/md'

export default function EditName({type, name, active, setShow}: {
  type: 'normal' | 'user'
  name?: string
  active?: boolean
  setShow?: Dispatch<SetStateAction<boolean>>
}){
  const inputRef = useRef<HTMLInputElement>(null)
  const [change, setChange] = useState(false)
  const [edit, setEdit] = useState(active || false)
  const [message, setMessage] = useState('')
  const [updatedName, setUpdatedName] = useState(name)
  const { user, setUser } = useUser()
  const [usersNames, setUsersNames] = useState<Pick<User, 'id' | 'userName'>[]>([])
  const { valid, setValid, setShowValidator } = useMeCtx()
  const { createNotification } = useNotifications()

  useEffect(()=> {
    if(inputRef.current){
      setTimeout(()=> {
        inputRef.current?.focus()
      }, 100)
    }

    if(valid){
      updateChanges()
      setValid(undefined)
    }
  }, [edit, valid])

  const activeEdit = () => {
    setEdit(true)
    if(type == 'user'){
      customFetch(`users?names=true`).then(res=> {
        if(res.length) setUsersNames(res)
        
      }).catch(()=> {
        console.error('Error in get users')
        createNotification({
          type: 'error',
          content: 'Ha ocurrido un error, buelve a intentarlo'
        })
      })
      
    }
  }

  const desactiveEdit = () => {
    setEdit(false)
    if((!change) && active && setShow) setShow(false)
  }

  const reactivateEdit = () => {
    if(change){
      setEdit(true)
    }
  }

  const handlerChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(value)

    if(value != name){
      setChange(true)
    
    }else{
      setChange(false)
    }

    if(type == 'user') {

      
      if(value.length < 4) return setMessage('Minimo 4 caracteres')
      
      if(!/^[a-zA-Z0-9]+$/.test(value)) return setMessage('Solo letras y números sin espacios ni otro tipo de caracteres')
       
      if(usersNames.some(s=> s.id != user?.id && s.userName == value)) return setMessage('Ese nombre de usuario ya lo tiene alguien más')

      if(message) setMessage('')
    }
  }

  function updateChanges() {
    if(user) customFetch(`users/${user.id}`, 'PATCH', type == 'normal' ? {name: updatedName} : {userName: updatedName}).then(res=> {
      if(res.id){
        setUser(res)
        setChange(false)
        if(setShow && (!updatedName)) setShow(false)
        createNotification({
          type: 'success',
          content: type == 'normal' ? 'Nombre actualizado' : 'Nombre de usuario actualizado'
        })
      }
    }).catch(()=> {
      console.error('Error in update user about')
      createNotification({
        type: 'error',
        content: type == 'normal' ? 'Error al actualizar el nombre' : 'Error al actualizar el nombre de usuario'
      })
    })
  }

  const saveChanges = () => {
    if(type == 'user' && !message) return setShowValidator(true)
    updateChanges()
  }
  
  const button = change ?
  (<div className={styles['me_profile_names-button']} onClick={saveChanges}>
    <MdSave className={styles['me_profile_names-button-icon']} /> 
  </div>) :
  (<div className={styles['me_profile_names-button']} onClick={activeEdit}>
    <FaEdit className={styles['me_profile_names-button-icon']}/>
  </div>)
    

  return (
    <>
      {type == 'normal' ?
        <div className={styles['me_profile-name']}>
          {button}
          {edit ? 
            <input ref={inputRef} onChange={handlerChange} onBlur={desactiveEdit} className={styles['me_profile-name-input']} type="text" defaultValue={updatedName} /> :
            <h2 className={styles['me_profile-name-content']} onClick={reactivateEdit}>{updatedName || '...'}</h2>
          }
        </div> :
        name && <div className={styles['me_profile-userName']}>
          <div className={styles['me_profile-userName-options']}>
            {button}
            {edit ?
              <div className={styles['me_profile-userName-div']}>
                @<input ref={inputRef} onChange={handlerChange} onBlur={desactiveEdit} className={styles['me_profile-userName-input']} type="text" defaultValue={updatedName} />  
              </div> :
              <p className={styles['me_profile-userName-content']} onClick={reactivateEdit}>@{updatedName || '...'}</p>
            }
          </div>
          {message && <p className={styles['me_profile-userName-message']}>{message}</p>}
        </div> 
      }
    </>
  )
}