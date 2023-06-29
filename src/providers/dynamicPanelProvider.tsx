import { useState, ReactNode } from 'react'
import { DynamicPanelContext, DynamicPanelContextTs } from "../contexts"

const data = {
  list: [
    {
      name: 'David',
      userName: 'David2004',
      age: 19
    },
    {
      name: 'Emily',
      userName: 'EmilyMedina',
      age: 18
    },
    {
      name: 'Jose',
      userName: '',
      age: 10
    },
    {
      name: 'Como',
      userName: '',
      age: 20
    },
    {
      name: 'Andres',
      userName: 'andres20',
      age: 12
    },
    {
      name: 'Aquino',
      userName: 'aquinoby',
      age: 20
    },
  ],
  
  elementComponent({item}: {item: {
    age: number
    name: string
    userName: string
  }}) {
    return (
      <li>
        <p>{item.name} {item.age}</p>
        <p>{item.userName}</p>
      </li>
    )
  },
}

export default function DynamicPanelProvider({ children }: { children: ReactNode }){
  const [panel, setPanel] = useState<DynamicPanelContextTs['panel']>()

  return (
    <DynamicPanelContext.Provider value={{ panel, setPanel }}>
      {children}
    </DynamicPanelContext.Provider>
  )
}