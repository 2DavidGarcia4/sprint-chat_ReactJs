import styles from './customEditForm.module.scss'

import { HTMLInputTypeAttribute, FormEvent, ChangeEvent, useRef, useMemo, useEffect, useState } from 'react'
import { useNotifications, useUser } from '@/hooks'
import { customFetch, handleHeight } from '@/utils/services'
import { BsX } from 'react-icons/bs'

export default function CustomEditForm({title, message, inputs, type, onClose}: {
  title: string
  message?: string
  inputs: {
    key: string
    type: HTMLInputTypeAttribute
    label: string
    field: string
    regex?: RegExp
    required?: boolean
    maxLength?: number
    defaultValue?: string
  }[]
  type?: 'status'
  onClose?: ()=> void
}){
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const inputsRef = useRef(inputs.map(({key, defaultValue})=> ({key, defaultValue: defaultValue || '', value: (defaultValue || '')})))
  const [errorMessage, setErrorMessage] = useState('')
  const [changes, setChanges] = useState(false)
  const { user, setUser } = useUser()
  const { createNotification } = useNotifications()

  const padding = useMemo(()=> {
    return window.innerWidth <= 500 ? 40 : 0
  }, [containerRef])

  useEffect(()=> {
    if(containerRef) {
      containerRef.classList.add(styles.show)
      handleHeight(containerRef, formRef.current, padding)

      firstInputRef.current?.focus()
    }
  }, [containerRef])

  const close = () => {
    containerRef?.classList.remove(styles.show)
    if(window.innerWidth <= 500){
      if(formRef.current) formRef.current.style.padding = ''
      if(containerRef) containerRef.style.height = ''
    }

    if(onClose) setTimeout(()=> {
      onClose()
    }, 500)
  }

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let body: {[key: string]: string} = {}

    for(let i of inputs){
      const input = inputsRef.current.find(f=> f.key == i.key)
      if(i.regex && input?.value && (!i.regex.test(input.value))) return setErrorMessage('El texto proporcionado no es un emoji.')
      if(i.maxLength && input && i.maxLength < input.value.length) return setErrorMessage(`El mensaje no debe de contener más de ${i.maxLength} caracteres.`)
      if(input?.value) body[i.field] = input.value
    }

    customFetch((type && type == 'status') ? `users/@me/status` : `users/${user?.id}`, 'PATCH', body).then(res=> {
      // console.log(res)

      if(res.id) {
        setUser(res)
        close()
        createNotification({
          type: 'success',
          content: type == 'status' ? 'Estado personalizado actualizado' : 'Avatar actualizado'
        })
      }
    }).catch(()=> {
      console.error('Error in custom update user')
      createNotification({
        type: 'error',
        content: type == 'status' ? 'Error al actualizar el estado' : 'Error al actualizar el avatar'
      })
    })
  }

  const handlerChange = ({target: {id, value}}: ChangeEvent<HTMLInputElement>) => {
    let acount = 0
    inputsRef.current.forEach(inp=> {
      if(inp.key == id) inp.value = value
            
      if(inp.value != inp.defaultValue) {
        acount++
        setChanges(true)
      }
    })

    if(!acount) setChanges(false) 
    if(errorMessage) setErrorMessage('')
    
    setTimeout(()=> {
      handleHeight(containerRef, formRef.current, padding)
      // if(containerRef) containerRef.style.height = formRef.current?.clientHeight + 'px'
    }, 100)
  }

  return (
    <div ref={setContainerRef} className={styles.container}>
      <form ref={formRef} onSubmit={handlerSubmit} className={styles.customEdit}>
        <div className={styles['customEdit_close']} onClick={close}>
          <BsX className={styles['customEdit_close-icon']}/>
        </div>

        <h4 className={styles['customEdit-title']}>{title}</h4>

        {message && <p className={styles['customEdit-message']}>{message}</p>}

        {inputs.map((i, index)=> <div key={i.key} className={styles['customEdit_option']}>
          <label className={styles['customEdit_option-label']} htmlFor={i.key}>{i.label}</label>
          <input ref={index == 0 ? firstInputRef : undefined} onChange={handlerChange} className={styles['customEdit_option-input']} type={i.type} id={i.key} defaultValue={i.defaultValue} maxLength={i.maxLength} required={i.required} />
        </div>)}
        
        {errorMessage && <p className={styles['customEdit-message']}>{errorMessage}</p>}
        {(changes && !errorMessage) && <button className={styles['customEdit-button']}>Guardar</button>}
      </form>
    </div>
  )
}