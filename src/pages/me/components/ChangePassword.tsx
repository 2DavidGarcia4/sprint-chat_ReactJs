import styles from '../me.module.scss'

import { useRef, useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useMeCtx } from '@/contexts'
import { customFetch } from '@/utils/services'
import { useNotifications, useUser } from '@/hooks'

export default function ChangePassword(){
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [newPasswordMessage, setNewPasswordMessage] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { user, setUser } = useUser()
  const { valid, setValid, setShowValidator } = useMeCtx()
  const { createNotification } = useNotifications()

  useEffect(()=> {
    if(newPassword && confirmPassword && valid){
      customFetch(`users/${user?.id}`, 'PATCH', {password: newPassword}).then(res=> {
        if(res.id) {
          setUser(res)

          setValid(undefined)
          setNewPassword('')
          setConfirmPassword('')
          if(confirmPasswordRef.current) confirmPasswordRef.current.value = ''
          if(newPasswordRef.current) newPasswordRef.current.value = ''

          createNotification({
            type: 'success',
            content: 'Contraseña cambiada'
          })
        }
      }).catch(()=> {
        console.error('Error in update password')
        createNotification({
          type: 'error',
          content: 'Error al cambiar la contraseña, intentalo mas tarde'
        })
      })
    }
  }, [valid])

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(newPassword != confirmPassword) return setNewPasswordMessage('Las contraseñas no son iguales')
    setShowValidator(true)
  }

  const changeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    if(newPasswordMessage) setNewPasswordMessage('')
  }

  const changeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if(newPasswordMessage) setNewPasswordMessage('')
  }

  return (
    <form onSubmit={handlerSubmit} className={styles['me_profile_option-form']}>
      <div className={styles['me_profile_option-form-section']}>
        <label className={styles['me_profile_option-form-label']} htmlFor="newPassword">Nueva contraseña</label>
        <input ref={newPasswordRef} className={styles['me_profile_option-form-input']} onChange={changeNewPassword} type="password" id='newPassword' placeholder='&nbsp;' minLength={8} required />
      </div>

      {newPassword && <div className={styles['me_profile_option-form-section']}>
        <label className={styles['me_profile_option-form-label']} htmlFor="confirmPassword">Confirmar contraseña</label>
        <input ref={confirmPasswordRef} className={styles['me_profile_option-form-input']} onChange={changeConfirmPassword} type="password" id='confirmPassword' placeholder='&nbsp;' minLength={8} required />
      </div>}

      {newPasswordMessage && <p className={styles['me_profile_option-form-message']}>{newPasswordMessage}</p>}
      {((!newPasswordMessage) && newPassword && confirmPassword) && <button className={styles['me_profile_option-form-button']}>Cambiar contraseña</button>}
    </form>
  )
}