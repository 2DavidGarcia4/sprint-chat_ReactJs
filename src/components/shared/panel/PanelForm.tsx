'use client'

import styles from './dynamicPanel.module.scss'

import { useState, FormEvent, ChangeEvent } from 'react'
import { PanelForm, useCtxDynamicPanel } from "@/contexts";
import { HiOutlineUsers } from 'react-icons/hi'

export default function PanelForm({panelForm, panelRef}: {panelForm: PanelForm, panelRef: HTMLDivElement | null}){
  const { setPanel } = useCtxDynamicPanel()
  const [imgUrl, setImgUrl] = useState('')
  const [enabledButton, setEnabledButton] = useState(!panelForm.inputs.some(s=> s.required && !s.defaultValue))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data: {[key: string]: string} = {}
    panelForm.inputs.forEach(i=> {
      if(e.currentTarget[i.key].value) data[i.key] = e.currentTarget[i.key].value
    })

    panelForm.handleSubmit(data)

    if(panelRef){
      panelRef.classList.remove(styles.show)
      setTimeout(()=> {
        setPanel(undefined)
      }, 500)
    }
  }

  const handleChange = ({currentTarget}: ChangeEvent<HTMLInputElement>) => {
    const value = currentTarget.value.trim()
    if(currentTarget.id.toLowerCase().includes('icon')){
      setImgUrl(value)
    }

    if(panelForm.inputs.some(s=> s.required && s.key == currentTarget.id)){
      if(value){
        if(!enabledButton) setEnabledButton(true)
      
      }else{
        if(enabledButton) setEnabledButton(false)
      }
    }
  }

  return (
    <>
      {panelForm.head}

      {panelForm.inputs.some(s=> s.key.toLowerCase().includes('icon')) &&
        <div className={styles['panel-container-icon']}>
          {imgUrl ? 
            <img src={imgUrl} alt="Image" width={80} height={80} /> :
            <HiOutlineUsers />
          }
        </div>
      }

      <form onSubmit={handleSubmit} className={styles['panel-container-form']}>
        {panelForm.inputs.map(i=> <div key={i.key}>
          <label htmlFor={i.key}>{i.label}</label>
          <input onChange={handleChange} type={i.type} id={i.key} placeholder={i.placeholder} maxLength={i.maxLength} autoComplete='off' defaultValue={i.defaultValue} required={i.required} />
        </div>)}

        <button className={`${enabledButton ? styles.enabled : ''}`}>{panelForm.buttonText}</button>
      </form>
    </>
  )
}