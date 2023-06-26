import styles from './dynamicPanel.module.scss'

import { useEffect, useState, MouseEvent } from 'react'
import { useCtxDynamicPanel } from '@/contexts'
import SearchableList from './SearchableList'
import PanelForm from './PanelForm'

export default function DynamicPanel(){
  const { panel, setPanel } = useCtxDynamicPanel()
  const [thisRef, setThisRef] = useState<HTMLDivElement | null>(null)

  useEffect(()=> {
    if(thisRef){
      if(!thisRef.classList.contains(styles.show)){
        thisRef.classList.add(styles.show)   
      }
    }
    
  }, [thisRef])
  
  const handlerClick = (e: MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget.childNodes.item(0)

    if(!container.contains(e.target as Node)){
      thisRef?.classList.remove(styles.show)
      setTimeout(()=> {
        setPanel(undefined)
      }, 500)
    } 
  }

  return (
    <>
      {panel && 
        <div ref={setThisRef} onClick={handlerClick} className={styles.panel}>
          <div className={styles['panel-container']}>
            {panel.title && 
              <div className={styles['panel-title']}>
                <p>{panel.title}</p>
              </div>
            }
            
            <div className={styles['panel-container-elements']}>
              {panel.searchable && <SearchableList searchable={panel.searchable} />}
              {panel.panelForm && <PanelForm panelForm={panel.panelForm} panelRef={thisRef} />}
            </div>
          </div>
        </div>
      }
    </>
  )
}


