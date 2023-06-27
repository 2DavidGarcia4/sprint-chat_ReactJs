import styles from './customEditForm.module.scss'

import { HTMLInputTypeAttribute, FormEvent, ChangeEvent, useRef, useEffect, useState } from 'react'
import { BsX } from 'react-icons/bs'
import { useUser } from '@/hooks'
import { customFetch } from '@/utils/services'

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
  onClose?: ()=> any
}){
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const inputsRef = useRef(inputs.map(({key, defaultValue})=> ({key, defaultValue: defaultValue || '', value: (defaultValue || '')})))
  const [errorMessage, setErrorMessage] = useState('')
  const [changes, setChanges] = useState(false)
  const { user, setUser } = useUser()

  useEffect(()=> {
    setTimeout(()=> {
      containerRef.current?.classList.add(styles.show)
      if(typeof window != 'undefined' && window.innerWidth <= 500){
        if(containerRef.current) containerRef.current.style.height = ((formRef.current?.clientHeight || 0) + 40) + 'px'
      }

      firstInputRef.current?.focus()
    }, 100)
  }, [])

  const close = () => {
    containerRef.current?.classList.remove(styles.show)
    if(typeof window != 'undefined' && window.innerWidth <= 500){
      if(formRef.current) formRef.current.style.padding = ''
      if(containerRef.current) containerRef.current.style.height = ''
    }

    if(onClose) setTimeout(()=> {
      onClose()
    }, 500)
  }

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let body: any = {}

    for(let i of inputs){
      const input = inputsRef.current.find(f=> f.key == i.key)
      if(i.regex && input?.value && (!i.regex.test(input.value))) return setErrorMessage('El texto proporcionado no es un emoji.')
      if(i.maxLength && input && i.maxLength < input.value.length) return setErrorMessage(`El mensaje no debe de contener más de ${i.maxLength} caracteres.`)
      body[i.field] = input?.value
    }

    customFetch((type && type == 'status') ? `users/@me/status` : `users/${user?.id}`, 'PATCH', body).then(res=> {
      // console.log(res)

      if(res.id) {
        setUser(res)
        close()
      }
    }).catch(()=> console.error('Error in custom update user'))
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
      if(typeof window != 'undefined'){
        if(containerRef.current) containerRef.current.style.height = formRef.current?.clientHeight + 'px'
      }
    }, 100)
  }

  return (
    <div ref={containerRef} className={styles.container}>
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