import styles from './me.module.scss'

import { useState, useCallback, type HTMLInputTypeAttribute } from 'react'
import { MeContext } from '@/contexts'
import { STORAGE_KEYS } from '@/utils/data'
import { useNotifications, useUser } from '@/hooks'
import { customFetch, navigate } from '@/utils/services'
import Option from './components/Option'
import AboutMe from './components/AboutMe'
import EditName from './components/EditName'
import EditColor from './components/EditColor'
import ChangePassword from './components/ChangePassword'
import PasswordValidator from './components/PasswordValidator'
import CircleStatus from '@/components/shared/status/CircleStatus'
import CustomEditForm from './components/customEdit/CustomEditForm'
import ConfirmationDialog from '@/components/custom/ConfirmationDialog'
import { IoMdAdd } from 'react-icons/io'
import { BsCircleFill } from 'react-icons/bs'
import { MdEmojiEmotions } from 'react-icons/md'
import { HiUser, HiPencil } from 'react-icons/hi'
import { RiLockPasswordFill } from 'react-icons/ri'

const status = [
  {
    type: 1,
    name: 'En linea'
  },
  {
    type: 2,
    name: 'Ausente'
  },
  {
    type: 3,
    name: 'No molestar'
  },
  {
    type: 0,
    name: 'Invisible'
  },
]

export default function Me(){
  const [showValidator, setShowValidator] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean | undefined>()
  const [showColorEdit, setShowColorEdit] = useState(false) 
  const [updatedColor, setUpdatedColor] = useState('')
  const { user, setUser } = useUser() 
  const [showAddName, setShowAddName] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { createNotification } = useNotifications()
  const [customEditData, setCustomEditData] = useState<{
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
  } | undefined>(undefined)

  const openEditColor = () => setShowColorEdit(true)

  const closeSession = useCallback(() => {
    if(typeof localStorage != 'undefined'){
      localStorage.removeItem(STORAGE_KEYS.token)
      setUser(undefined)
      navigate('/login')
      createNotification({
        type: 'success',
        content: 'Sección cerrada'
      })
    }

    setShowConfirmation(false)
  }, [setUser])

  const openEditAvatar = useCallback(() => {
    setCustomEditData({
      title: 'Editar avatar',
      inputs: [
        {
          key: 'avatar',
          type: 'url',
          label: 'Avatar url',
          field: 'avatarUrl',
          required: false,
          defaultValue: user?.avatarUrl || undefined
        }
      ]
    })
  }, [user])

  const openEditCustomStatus = useCallback(() => {
    setCustomEditData({
      title: 'Editar avatar',
      type: 'status',
      inputs: [
        {
          key: 'emoji',
          type: 'text',
          label: 'Emoji',
          field: 'emoji',
          regex: /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u,
          required: false,
          defaultValue: user?.status?.emoji || undefined
        },
        {
          key: 'message',
          type: 'text',
          label: 'Mensaje',
          field: 'message',
          required: false,
          maxLength: 100,
          defaultValue: user?.status?.message || undefined
        }
      ]
    })
  }, [user])

  return (
    <section className={styles.me}>
      {showConfirmation && <ConfirmationDialog 
        title='Cerrar sesíon' 
        description='¿Seguro que quieres cerrar sesíon?'
        type='danger'
        onConfirm={closeSession}
        onCancel={()=> setShowConfirmation(false)} />
      }
      {customEditData && <CustomEditForm 
        {...customEditData} onClose={()=> setCustomEditData(undefined)} />
      }

      {showColorEdit && <EditColor color={user?.color || undefined} updatedColor={updatedColor} setupdatedColor={setUpdatedColor} setShow={setShowColorEdit} />}
      <MeContext.Provider value={{ showValidator, setShowValidator, valid, setValid }}>
        {showValidator && <PasswordValidator />}
        
        <div className={styles['me_profile']}>

          <div className={styles['me_profile-color']} style={{backgroundColor: updatedColor || user?.color || undefined}}>
            <div className={styles['me_profile-colorIcon']} onClick={openEditColor} >
              <HiPencil />
            </div>
          </div>

          <div className={styles['me_profile-info']}>
            <div className={styles['me_profile-avatar']}>
              <div className={styles['me_profile-avatar-editIcon']} onClick={openEditAvatar} >
                <HiPencil />
              </div>
              {user?.avatarUrl ?
                <img className={styles['me_profile-avatar-img']} src={user.avatarUrl} alt={`Avatar de ${user.userName}`} width={80} height={80} /> :
                <HiUser className={styles['me_profile-avatar-icon']} />
              }
              {user?.status && <CircleStatus status={user.status} size={24} />}
            </div>
            
            <div>
              <div className={styles['me_profile-names']}>
                {
                  user?.name ?
                  <EditName type='normal' name={user.name} setShow={setShowAddName} /> :
                  (showAddName ?
                    <EditName type='normal' active={true} setShow={setShowAddName} /> :
                    <div className={styles['me_profile_names-addName']} onClick={()=> setShowAddName(true)}>
                      <div className={styles['me_profile_names-button']}>
                        <IoMdAdd  />
                      </div>
                      <p className={styles['me_profile_names-addName-text']}>agregar nombre</p>
                    </div>  
                  )
                }
                {user?.userName && <EditName type='user' name={user?.userName} />}
              </div>
              <div className={styles['me_profile-badges']} />
            </div>

            {(user?.status?.emoji || user?.status?.message) && <div className={styles['me_profile_status']}>
              {user.status.emoji && <p className={styles['me_profile_status-emoji']}>{user.status.emoji}</p>}
              {user.status.message && <p className={styles['me_profile_status-message']}>{user.status.message}</p>}
            </div>}

            <AboutMe userId={user?.id} about={user?.about == null ? undefined : user.about} />
            
            <div className={styles['me_profile-section']}>
              <Option head={(
                <>
                  <BsCircleFill className={styles['me_profile_option-icon']} />
                  <p>Editar estado</p>
                </>
              )} >
                <ul className={styles['me_profile-status']}>
                  {status.map(s=> {
                    const selectStatu = () => {
                      if(user?.status?.type == s.type) return
                      
                      customFetch(`users/@me/status`, 'PATCH', {type: s.type}).then(res=> {
                        if(res.id){
                          localStorage.setItem(STORAGE_KEYS.status, s.type.toString())
                          setUser(res)
                          createNotification({
                            type: 'success',
                            content: 'Estado actualizado'
                          })
                        }
                      }).catch(()=> {
                        console.error('Error in update status')
                        createNotification({
                          type: 'error',
                          content: 'Error al actualizar el estado'
                        })
                      })
                    }

                    return (
                      <li key={s.type} className={styles['me_profile_statu']} onClick={selectStatu}>
                        <div className={styles['me_profile_statu-icon']}></div>
                        <p className={styles['me_profile_statu-type']}>{s.name}</p>
                      </li>
                    )
                  })}
                </ul>
                <div className={styles['me_profile_customStatu']} onClick={openEditCustomStatus}>
                  <p className={styles['me_profile_customStatu-emoji']}>
                    <MdEmojiEmotions />
                  </p>
                  <p className={styles['me_profile_customStatu-text']}>Establecer estado personalizado</p>
                </div>
              </Option>

              <Option head={(
                <>
                  <RiLockPasswordFill className={styles['me_profile_option-icon']} />
                  <p>Cambiar contraseña</p>
                </>
              )} >
                <ChangePassword />
              </Option>
            </div>

            <div className={`${styles['me_profile-section']} ${styles.closeSession}`} onClick={()=> setShowConfirmation(true)}>
              <p className={styles['me_profile-section-text']}>Cerrar sesión</p>
            </div>
          </div>
        </div>
      </MeContext.Provider>
    </section>
  )
}