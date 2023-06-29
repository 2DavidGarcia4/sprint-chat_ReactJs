import styles from '../me.module.scss'

import { useRef, useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { useMeCtx } from '@/contexts'
import { customFetch } from '@/utils/services'
import { BsX } from 'react-icons/bs'

export default function PasswordValidator(){
  const validatorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setValid, setShowValidator } = useMeCtx()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(()=> {
    if(validatorRef.current){
      setTimeout(()=> {
        validatorRef.current?.classList.add('showDialog')
        inputRef.current?.focus()
      }, 100)
    }
  }, [])

  const closeValidator = () => {
    if(validatorRef.current){
      validatorRef.current?.classList.add('hidenDialog')
      setTimeout(()=> {
        setShowValidator(false)
      }, 500)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const password = e.currentTarget.password.value

    customFetch(`users/@me/password`, 'POST', {password}).then(res=> {
      if(typeof res == 'boolean' && res) {
        setValid(true)
        closeValidator()
      }else{
        setMessage('Contraseña incorecta')
      }
    }).catch(()=> {
      console.error('Error in verify password')
      setMessage('Ha ocurrido un error al verificar la contraseña, intentalo mas tarde')
    })
  }

  const handleChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
    setPassword(value)
    if(message) setMessage('')
  }

  return (
    <div ref={validatorRef} className={styles.container}>
      <form className={styles.validator} onSubmit={handleSubmit}>
        <div className={styles['validator_close']} onClick={closeValidator} >
          <BsX className={styles['validator_close-icon']} />
        </div>

        <h5 className={styles['validator-title']}>Ingresa tu contraseña para continuar</h5>

        <input ref={inputRef} className={styles['validator-input']} onChange={handleChange} id='password' type="password" placeholder='&nbsp;' minLength={8} required />

        {message && <p className={styles['validator-message']}>{message}</p>}
        
        {(password && !message) && <button className={styles['validator-button']}>Continuar</button>}
      </form>
    </div>
  )
}