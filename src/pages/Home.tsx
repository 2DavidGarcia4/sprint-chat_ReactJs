import styles from './page.module.scss'

import { transformText } from '@/utils/services'
import { Link } from '@/components/router'

const options = [
  {
    path: '/welcome',
    emoji: '👋',
    title: 'Bievenido',
    description: '¿Heres nuevo?, breve introducción y registro.',
  },
  {
    path: '/chats',
    emoji: '💬',
    title: 'Chatear',
    description: 'Comienza a chatear, crear grupos y divertirte con tus amigos.',
  },
  {
    path: '/updates',
    emoji: '🔁',
    title: 'Actualizaciones',
    description: 'Descubre por lo que ha pasado esta app.',
  },
  {
    path: '/terms',
    emoji: '📖',
    title: 'Términos y condiciones',
    description: 'Términos y condiciones de la aplicación.',
  },
]

export default function HomePage() {
  return (
    <section className={styles.home}>
      <div className={styles['home_description']}>
        <div className={styles['home_description-text']} dangerouslySetInnerHTML={{__html: transformText('**Un lugar** en donde puedes hablar con tus amigos desde la web tan solo con buscarlos y agregarlos a tu lista de amigos.\n\n**Crear grupos** desde algunos amigos hasta cientos de personas, dar permisos a otros miembros para que te ayuden con el grupo.\n\n**Invitar a tus amigos** a un grupo con solo pasarle una invitación.\n\n*Proyecto personal al que le tengo mucha ilusión del potencial que puede tener*')}} />

      </div>
      
      <div >
        <ul className={styles['home-options']}>
          {options.map(o=> <li key={o.path} className={styles['home_option']} >
            <Link href={o.path}>
              <div className={styles['home_option-title']}>
                <p className={styles['home_option-title-emoji']}>{o.emoji}</p>
                <p className={styles['home_option-title-text']}>{o.title}</p>
              </div>
              <p className={styles['home_option-description']}>{o.description}</p>
            </Link>
          </li>)}
        </ul>
      </div>
    </section>
  )
}
