'use client'

import styles from './showChats.module.scss'

import { useState, MouseEvent } from 'react'
import { HiOutlineFolderAdd, HiSearch, HiOutlineUser } from 'react-icons/hi'
import { RiArchiveDrawerLine } from 'react-icons/ri'
import { BiMessageRoundedAdd } from 'react-icons/bi'
import { GrAddCircle } from 'react-icons/gr'
import { useTooltip } from '@/hooks/useTooltip'
import { useCtxDynamicPanel, useCtxUser } from '@/contexts'
import { Link } from '../router'
import { customFetch } from '@/utils/services'

const users = [
  {
    name: 'David',
    age: 19,
    userName: 'David2004',
    avatarUrl: 'https://media.discordapp.net/attachments/1064289166462042137/1076587710996824064/welcome.png?width=467&height=467'
  },
  {
    name: 'Emily',
    userName: 'EmilyMedina',
    avatarUrl: null
  },
  {
    name: 'Jose',
    age: 10,
    userName: '',
    avatarUrl: null
  },
  {
    name: 'Como',
    age: 20,
    userName: '',
    avatarUrl: 'https://media.discordapp.net/attachments/1064289166462042137/1077329098579386428/design-mascot-cute-robot-cartoon-260nw-1793124361.png?width=142&height=144'
  },
  {
    name: 'Andres',
    age: 12,
    userName: 'andres20',
    avatarUrl: null
  },
  {
    name: 'Aquino',
    age: 20,
    userName: 'aquinoby',
    avatarUrl: null
  },
]

export default function HeaderChats(){
  const [open, setOpen] = useState(false)
  const { setPanel } = useCtxDynamicPanel()
  const { events, createTooltipOptions } = useTooltip()
  const { user } = useCtxUser()

  const createChat = (e: MouseEvent<HTMLLIElement>) => {
    createTooltipOptions(e, [
      {
        icon: <BiMessageRoundedAdd />,
        name: 'Crear chat',
        function: async () => {
          const res = await customFetch('friends')
          
          console.log('Creando chat', res)
          setPanel({
            title: 'Selecciona un amigo para crear un chat con él',
            searchable: {
              optionalContent: (
              <>
                <h4>Parece que aún no hay amigos con los que chatear</h4>
                <p>Puedes enviar solicitudes de amistad a tus amigos y esperar a que te acepten para empezar a chatear con ellos.</p>
                <Link href={'/friends'} onClick={()=> setPanel(undefined)} >Ír a la pestaña de Amigos</Link>
              </>),
              list: res,
              target: 'name',
              itemComponent({item}: {item: {
                age: number
                name: string
                userName: string
                avatarUrl: string | null
              }}) {
                const handlerClick = () => {
                  console.log('click', item)
                }

                return (
                  <li onClick={handlerClick}>
                    <div>
                      {item.avatarUrl ?
                        <img src={item.avatarUrl} alt={`Avatar de ${item.userName}`} width={40} height={40} /> :
                        <HiOutlineUser /> 
                      }
                    </div>

                    <div>
                      <p>{item.name} {item.age}</p>
                      {item.userName &&
                        <p>@{item.userName}</p>
                      }
                    </div>
                  </li>
                )
              }
            }
          })
        },
      },
      {
        icon: <HiOutlineFolderAdd />,
        name: 'Crear grupo',
        function: () => {
          console.log('Creando grupo')
          setPanel({
            title: 'Crea tu grupo',
            panelForm: {
              buttonText: 'Crear grupo',
              head: (
                <p>Un grupo es un lugar donde pues hablar con todos tus amigos</p>
              ),
              inputs: [
                {
                  key: 'iconUrl',
                  type: 'url',
                  label: 'URL del icon',
                  placeholder: 'Opcional'
                },
                {
                  key: 'name',
                  type: 'text',
                  label: 'Nombre del grupo',
                  defaultValue: `Grupo de ${user?.userName || user?.name}`,
                  required: true
                },
                {
                  key: 'description',
                  type: 'text',
                  label: 'Descripción del grupo',
                  maxLength: 200,
                  placeholder: 'Opcional'
                }
              ],
              handleSubmit(obj: object) {
                customFetch('chats', 'POST', {
                  type: 1,
                  ...obj
                }).then(res=> {
                  console.log(res)

                }).catch(()=> {
                  console.log('Error in create group')
                })
              },
            }
          })
        },
      }
    ])
  }

  return (
    <header className={styles.header}>
      <div className={`${styles['header-toggle']} button`}>
        {open ? <p className='button-icon'>📂</p> : <p className='button-icon'>📁</p>}
      </div>
      
      <ul className={styles['header-options']}>
        <li {...events} className={'button'} data-direction='bottom' data-name='Chats archivados'>
          <RiArchiveDrawerLine className='button-icon' />
        </li>

        <li {...events} onClick={createChat} className={'button'} data-direction='bottom' data-name='Crear chat'>
          <GrAddCircle className='button-icon' />
        </li>

        <li {...events} className={'button'} data-direction='bottom' data-name='Buscar chat'>
          <HiSearch className='button-icon' />
        </li>
      </ul>
    </header>
  )
}