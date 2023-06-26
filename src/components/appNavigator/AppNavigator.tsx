import styles from './appNavigator.module.scss'

import { Link } from '../router' 
import { BsChatLeftText, BsChatLeftTextFill } from 'react-icons/bs'
import { RiContactsLine, RiContactsFill } from 'react-icons/ri'
import { HiOutlineUser, HiUser } from 'react-icons/hi'
import { BsGear, BsGearFill } from 'react-icons/bs'
import { useUser, useRoute } from '@/hooks'
import { useCtxUser } from '@/contexts'
import { MouseEvent } from 'react'
import CircleStatus from '../status/CircleStatus'
import { useTooltip } from '@/hooks/useTooltip'

export default function AppNavigator(){
  const { protectedRoute } = useUser()
  const { pathName } = useRoute()
  const { user } = useCtxUser()
  const { events } = useTooltip()

  const isActiveRoute = (routName: string) => pathName.includes(routName)

  const handlerClick = ({currentTarget: { classList }}: MouseEvent<HTMLLIElement>) => {
    classList.add(styles.animation)
    setTimeout(()=> {
      classList.remove(styles.animation)
    }, 400)
    protectedRoute()
  }

  return (
    <nav className={`${styles.navigator} `}>
      <ul className={styles.navigator_elements}>
        <li {...events} onClick={handlerClick} className={`${styles.navigator_elements_item} ${isActiveRoute('/chats') ? styles.selected : ''}`} data-name='Chats' data-direction='top'>
          <Link href={'/chats'}>
            {isActiveRoute('/chats') ? <BsChatLeftTextFill className={styles.navigator_icon}  /> : <BsChatLeftText className={styles.navigator_icon} />}
          </Link>
        </li>
        <li {...events} onClick={handlerClick} className={`${styles.navigator_elements_item} ${isActiveRoute('/me') ? styles.selected : ''}`} data-name='Tu perfil' data-direction='top'>
          <Link href={'/me'}>
            <div className={styles.navigator_elements_user}>
              {
                user?.avatarUrl ?
                <img className={styles.navigator_avatar} src={user.avatarUrl} alt='User avatar' width={34} height={34} /> :
                (isActiveRoute('/me') ? <HiUser className={styles.navigator_icon} /> : <HiOutlineUser className={styles.navigator_icon} />)
              }
              {user?.status &&
                <CircleStatus status={user.status} />
              }
              
            </div>
          </Link>
        </li>
        <li {...events} onClick={handlerClick} className={`${styles.navigator_elements_item} ${isActiveRoute('/friends') ? styles.selected : ''}`} data-direction='top' data-name='Tus amigos'>
          <Link href={'/friends'}>
            {isActiveRoute('/friends') ? <RiContactsFill className={styles.navigator_icon} /> : <RiContactsLine className={styles.navigator_icon} />}
          </Link>
        </li>
        <li {...events} onClick={handlerClick} className={`${styles.navigator_elements_item} ${isActiveRoute('/settings') ? styles.selected : ''}`} data-direction='top' data-name='Configuración'>
          <Link href={'/settings'}>
            {isActiveRoute('/settings') ? <BsGearFill className={styles.navigator_icon} /> : <BsGear className={styles.navigator_icon} />}
          </Link>
        </li>
      </ul>
    </nav>
  )
}