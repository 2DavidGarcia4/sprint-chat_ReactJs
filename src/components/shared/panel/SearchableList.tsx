import styles from './dynamicPanel.module.scss'

import { useEffect, useState, ChangeEvent } from 'react'
import { Searchable } from '@/contexts'
import { BsSearch } from 'react-icons/bs'

export default function SearchableList({searchable}: {searchable: Searchable}){
  const [elementsList, setElementsList] = useState<any[]>([])
  const [input, setInput] = useState<HTMLInputElement | null>(null)

  const inputFocus = () => {
    if(input){
      input.focus()
    }
  }

  useEffect(()=> {
    inputFocus()
  }, [input])

  const handlerChange = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
    let target = value.trim()
    if(target){
      // console.log('!Hey¡ hola 🤨')
      setElementsList(searchable.list.filter(f=> f[searchable?.target as string].toLowerCase().includes(target.toLowerCase())))
    }else if(elementsList.length) setElementsList([])

  }

  return searchable.list.length ?
  <>
    <div className={styles['panel-container-search']}>
      <BsSearch onClick={inputFocus} className={styles['panel-container-search-icon']}/>
      <input ref={setInput} onChange={handlerChange} className={styles.input} type="search" />
    </div>

    <ul className={styles['panel-container-list']}>
      {elementsList.length ?
        elementsList.map((e, i)=> <searchable.itemComponent key={i} item={e} />) :
        searchable.list.map((e, i)=> <searchable.itemComponent key={i} item={e} />)
      }
    </ul> 
  </> :
  searchable.optionalContent
}