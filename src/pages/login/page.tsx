import styles from './login.module.scss'

import { useUser } from '@/hooks/useUser'
import CustomForm from '@/components/form/CustomForm'
import CustomMessage from '@/components/message/CustomMessage'
import { useEffect, useState } from 'react'
import { navigate } from '@/utils/services'

export default function Login(){
  const { isLoged } = useUser()
  const [autoRedirect, setAutoRedirect] = useState(true)

  useEffect(()=> {
    if(isLoged){
      setAutoRedirect(true)
      setTimeout(()=> {
        navigate('/')
      }, 10000)
      
    }else{
      setAutoRedirect(false)
    }
  }, [isLoged])

  return (
    <section className={styles.login}>
      {(autoRedirect && isLoged) ?
        <CustomMessage content='Ya has iniciado sesión.' time={10} /> :
        <CustomForm type='login' />
      }
    </section>
  )
}