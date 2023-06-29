import styles from '../friends.module.scss'

import { MouseEvent, Dispatch, SetStateAction } from 'react'
import { useTooltip } from '@/hooks/useTooltip'
import NotificationBadge from '@/components/notifications/NotificationBadge'
import { IoPersonAddOutline, IoPersonAdd } from 'react-icons/io5' 
import { BsPeople, BsPeopleFill, BsMailbox, BsMailbox2 } from 'react-icons/bs' 

const elements = [
  {
    name: 'Lista de amigos',
    icon: BsPeople,
    activationIcon: BsPeopleFill
  },
  {
    name: 'Agregar amigo',
    icon: IoPersonAddOutline,
    activationIcon: IoPersonAdd
  },
  {
    name: 'Solicitudes pendientes',
    icon: BsMailbox,
    activationIcon: BsMailbox2
  },
]

export default function HeaderFriends({activationIndex, setActivationIndex, requests}: {
  activationIndex: number
  setActivationIndex: Dispatch<SetStateAction<number>>
  requests: number
}){
  const { events } = useTooltip()

  return (
    <header className={styles['friends_header']}>
      <ul className={styles['friends_header-elements']}>
        {elements.map((e, i)=> {
          const handleClick = ({currentTarget}: MouseEvent<HTMLLIElement>) => {
            setActivationIndex(i)
            currentTarget.classList.add(styles.animate)
            setTimeout(()=> currentTarget.classList.remove(styles.animate), 400)
          }

          return (<li key={i} className='button' onClick={handleClick} {...events} data-direction='bottom' data-name={e.name}>
            {
              activationIndex == i ?
              <e.activationIcon className='button-icon' /> :
              <e.icon className='button-icon' />
            }
            {(i == 2 && requests != 0) && <NotificationBadge notifications={requests} />}
          </li>
        )
        })}
      </ul>
    </header>
  )
}