import styles from './customForm.module.scss'

import { FormEvent, useState, MouseEvent } from 'react'
import { STORAGE_KEYS } from '@/utils/data'
import { useNotifications, useUser } from '@/hooks'
import { customFetch, navigate } from '@/utils/services'
import { Link } from '../router'
import { BsX } from 'react-icons/bs'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function CustomForm({type}: {type: 'login' | 'register'}){
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [showConfir, setShowConfir] = useState(false)
  const { setUser } = useUser()
  const { createNotification } = useNotifications()

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fields = Object.fromEntries(new window.FormData(e.currentTarget))
    
    if(type == 'login'){
      customFetch(`auth/login`, 'POST', fields).then(res=> {

        if(res.status == 401) return setError('Campos inválidos\nEl coreo o la contraseña es invalida.')

        if(res.token){
          localStorage.setItem(STORAGE_KEYS.TOKEN, res.token)
          createNotification({
            type: 'success',
            content: 'Sesión iniciada'
          })
          customFetch(`users/@me`).then(res=> {
            if(res.id) setUser(res)
          })
          navigate('/')
        }
      })
      .catch(()=> {
        console.error('Error in login')
        createNotification({
          type: 'error',
          content: 'Ha ocurrido un error al iniciar la sesión'
        })
      })

    }else{
      if(fields.password != fields.confirmPassword) return setError('Las contraseñas son diferentes')

      customFetch(`auth/register`, 'POST', fields).then(res=> {
        if(res.status == 400) {
          if(res.message.includes('llave duplicada') && res.message.includes('user_name')) return setError('El nombre de usuario que ingresaste ya ha sido utilizado por otro usuario.\nIngresa otro nombre de usuario')
          if(res.message.includes('llave duplicada') && res.message.includes('email')) return setError('El correo que ingresaste pertenece a otro usuario.\nIngresa otro correo.')
        }

        if(res.token){
          localStorage.setItem(STORAGE_KEYS.TOKEN, res.token)
          navigate('/')
        }

        if(res.user) {
          setUser(res.user)
          createNotification({
            type: 'success',
            content: 'Te has registrado'
          })
        }
      })
      .catch(()=> {
        console.error('Error in register')
        createNotification({
          type: 'error',
          content: 'Ha ocurrido un error al registrarse'
        })
      })
    }
  }

  const togglePassword = ({currentTarget: {id}}: MouseEvent<SVGElement>) => {
    if(id == 'password') setShow(s=> !s)
    else setShowConfir(sc=> !sc)
  }

  const closeError = () => {
    setError('')
  }

  const handlerChange = () => {
    if(error) setError('')
  }

  return (
    <form className={styles.form} onSubmit={handlerSubmit} >
      <div className={styles.form_header}>
        <img className={styles['form_header-image']} src={'/sprint-icon.png'} alt='icon' width={40} height={40} />
        <h2>Sprint chat</h2>
      </div>

      {type == 'register' && (
        <div className={styles['form-element']}>
          <div>
            <input className={styles['form-input']} onChange={handlerChange} type="text" name='userName' placeholder='&nbsp;' pattern="^[a-zA-Z0-9]+$" minLength={4} required />
            <span className={styles['form-name']}>Nombre de usuario</span>
          </div>
          <p className={styles['form-element-info']}>Su nombre de usuario debe de ser unico y tener entre <strong>4</strong> y <strong>30</strong> caracteres, y no debe contener espacios, caracteres especiales ni emojis.</p>
        </div>
      )}

      <div className={styles['form-element']}>
        <input className={styles['form-input']} onChange={handlerChange} type="email" name='email' placeholder='&nbsp;' required />
        <span className={styles['form-name']}>Correo</span>
      </div>

      <div className={styles['form-element']}>
        <div>
          <input className={styles['form-input']} onChange={handlerChange} type={show ? "text" : "password"} name='password' placeholder='&nbsp;' minLength={8} maxLength={20} required />
          <span className={styles['form-name']}>Contraseña</span>
        </div>
        {show ? <AiOutlineEye className={styles['form-eye']} id='password' onClick={togglePassword} /> : <AiOutlineEyeInvisible className={styles['form-eye']} id='password' onClick={togglePassword} />}
        {type == 'register' && 
          <p className={styles['form-element-info']}>Su contraseña debe tener entre <strong>8</strong> y <strong>20</strong> caracteres, contener letras y números, y no debe contener espacios, caracteres especiales ni emojis.</p>
        }
      </div>

      {type == 'register' && <div className={styles['form-element']}>
        <div>
          <input className={styles['form-input']} onChange={handlerChange} type={showConfir ? "text" : "password"} name='confirmPassword' placeholder='&nbsp;' minLength={8} maxLength={20} required />
          <span className={styles['form-name']}>Confirmar contraseña</span>
        </div>
        {showConfir ? <AiOutlineEye className={styles['form-eye']} id='confirmPassword' onClick={togglePassword} /> : <AiOutlineEyeInvisible className={styles['form-eye']} id='confirmPassword' onClick={togglePassword} />}
      </div>}

      {error && <div className={styles['form_error']}>
        <BsX className={styles['form_error-close']} onChange={handlerChange} onClick={closeError} />
        <p className={styles['form_error-text']}>{error}</p>
      </div>}

      <button className={styles['form-button']}>{type == 'login' ? 'Iniciar sección' : 'Registrarse'}</button>
      
      {
        type == 'login' ?
          <p className={styles['form-text']}>Aun no tienes una cuenta?, <Link className={styles['form-link']} href={'/register'}>registrate</Link></p> :
          <p className={styles['form-text']}>Ya tienes una cuenta?, <Link className={styles['form-link']} href={'/login'}>inicia sesión</Link></p>
      }
    </form>
  )
}