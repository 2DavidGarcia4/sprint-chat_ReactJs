import styles from '../friends.module.scss'

export default function ItemsList({ children, title, items }: { children: React.ReactNode, title: string, items: number }){
  return (
    <div className={styles.section_items}>
      <div className={styles['section_items-title']}>
        <p>{title}{items > 1 ? 's' : ''}: <strong>{items}</strong></p>
        <div />
      </div>

      <ul className={styles['section_items-list']}>
        {children}
      </ul>
    </div>
  )
}