import styles from './navigator.module.scss'

import { Link } from '../router'
import { useRef } from 'react'
import { BsX } from 'react-icons/bs'
import { BiMenuAltRight } from 'react-icons/bi'
import AppNavigator from '../appNavigator/AppNavigator'
import { appRoutes, oterRoutes } from '@/utils/data'
import { useRoute } from '@/hooks/useRoute'

const routes = [
  {
    name: 'Chat',
    path: '/chats'
  },
  {
    name: 'Acerca',
    path: '/about'
  },
  {
    name: 'Actualizaciones',
    path: '/updates'
  },
]

export default function Navigator(){
  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const { pathName } = useRoute()
  
  const inRoute = (route: string) => pathName == route

  const toggleNav = () => {
    navRef.current?.classList.toggle(styles.open)
  }

  if(typeof document != "undefined"){
    document.addEventListener('scroll', () => {
      headerRef.current?.classList.toggle(styles.active, window.scrollY > 80)
    })
  }

  return (
    <>
      {!oterRoutes.some(r=> pathName.includes(r)) &&
      (!appRoutes.some(r=> pathName.includes(r)) ? <header ref={headerRef} className={styles.header}>
        <div className={styles['header-container']}>
          <Link className={styles['header_title']} href={'/'}>
            <img className={styles['header_title-image']} src={'/sprint-icon.png'} alt='Logo' width={40} height={40} />
            <h1 className={styles['header_title-text']}>Sprint chat</h1>
          </Link>
          <BiMenuAltRight className={`${styles.icon} ${styles['header-open']}`} onClick={toggleNav} />

          <nav ref={navRef} className={styles.nav}>
            <BsX className={`${styles.icon} ${styles['nav-close']}`} onClick={toggleNav} />
            <ul className={styles['nav-items']}>
              {routes.map(r=> <li key={r.path} className={`${styles['nav_item']} ${inRoute(r.path) ? styles.selected : ''}`}>
                <Link className={styles['nav_item-link']} href={r.path}>
                  {r.name}
                </Link>
              </li>)}
            </ul>
          </nav>
        </div>
      </header> :
      <AppNavigator />
      )}
    </>
  )
}