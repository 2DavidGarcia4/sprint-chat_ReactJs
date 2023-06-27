import styles from '../me.module.scss'

import { useRef, useState, ChangeEvent } from 'react'
import { transformText, customFetch } from '@/utils/services'
import { FaEdit } from 'react-icons/fa'
import { MdSave } from 'react-icons/md'
import { useUser } from '@/hooks'

const charLimit = 200

export default function AboutMe({userId, about}: {userId?: string, about?: string}){
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [activeEdit, setActiveEdit] = useState(false)
  const [changes, setChanges] = useState(false)
  const [updatedAbout, setUpdatedAbout] = useState('')
  const [characters, setCharacters] = useState(about ? charLimit-about.length : charLimit-updatedAbout.length)
  const { setUser } = useUser()

  const activeTextArea = () => {
    setActiveEdit(true)
    
    if(textAreaRef.current){
      setTimeout(()=> {
        textAreaRef.current?.focus()
      }, 200)
    }
  }

  const reactiveTextArea = () => {
    if(changes){
      activeTextArea()
    }
  }
  
  const saveChages = () => {
    setActiveEdit(false)
    setChanges(false)

    if(userId) customFetch(`users/${userId}`, 'PATCH', {about: updatedAbout}).then(res=> {
      if(res.id){
        setUser(res)
        // createNotification({
        //   type: 'success',
        //   content: 'Updated name'
        // })
      }
    }).catch(()=> {
      console.error('Error in update user about')
      // createNotification({
      //   type: 'error',
      //   content: 'Error updating name'
      // })
    })
  }

  const desactiveTextArea = () => {
    setActiveEdit(false)
  }

  const handlerChange = ({target: {value}}: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedAbout(value)
    setCharacters(charLimit-value.length)
    
    if(value != about){
      setChanges(true)
    }else{
      setChanges(false)
    }
  }

  return (
    <div className={styles['me_profile-section']}>
      {changes ?
        (
          <div className={styles['me_profile-section-edit']} onClick={saveChages} >
            <MdSave className={`${styles['me_profile-section-icon']} ${styles.save}`}/>
          </div>
        ) :
        (
          <div className={styles['me_profile-section-edit']} onClick={activeTextArea}>
            <FaEdit className={styles['me_profile-section-icon']}/>
          </div>
        )
      }

      <h4 className={styles['me_profile-section-title']}>Sobre mí</h4>

      <div className={`${styles['me_profile-section-editAbout']} ${activeEdit ? styles.show : ''}`}>
        <textarea ref={textAreaRef} className={styles['me_profile-section-textArea']} onChange={handlerChange} onBlur={desactiveTextArea} defaultValue={about} maxLength={charLimit} />
        <p className={styles['me_profile-section-editAbout-characters']}>{characters}</p>
      </div>

      {(!about && !updatedAbout && !activeEdit) && <p className={styles['me_profile-section-message']}>¡Aun no tienes información sobre ti!</p>}
      {((about || updatedAbout) && !activeEdit) && <div className={`${styles['me_profile-section-about']}`} dangerouslySetInnerHTML={{__html: transformText(updatedAbout || about || '')}} onClick={reactiveTextArea} ></div>}
    </div>
  )
}