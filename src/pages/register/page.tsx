import styles from './register.module.scss'

import { useUser } from '@/hooks/useUser';
import CustomForm from "@/components/form/CustomForm";
import CustomMessage from '@/components/message/CustomMessage';
import { useEffect, useState } from 'react';
import { navigate } from '@/utils/services';

export default function Register(){
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
    <section className={styles.register}>
      {(autoRedirect && isLoged) ?
        <CustomMessage content='Ya te has registrado.' time={10} /> :
        <CustomForm type="register" />
      }
    </section>
  )
}