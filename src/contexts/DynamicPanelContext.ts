import { createContext, type Dispatch, type SetStateAction, type HTMLInputTypeAttribute } from 'react'

export interface Searchable {
  list: any[]
  target: string
  optionalContent: JSX.Element
  itemComponent: ({item}: {item: any}) => JSX.Element
}

interface Input {
  key: string
  type: HTMLInputTypeAttribute
  label: string
  regex?: RegExp
  required?: boolean
  maxLength?: number
  placeholder?: string
  defaultValue?: string
}

export interface PanelForm {
  head: JSX.Element
  inputs: Input[]
  buttonText: string
  handleSubmit: (param: any) => any
}

interface DynamicPanel {
  title?: string
  searchable?: Searchable
  panelForm?: PanelForm
}

export interface DynamicPanelContextTs {
  panel: DynamicPanel | undefined
  setPanel: Dispatch<SetStateAction<DynamicPanel | undefined>>
  close: boolean
  setClose: Dispatch<SetStateAction<boolean>> 
  closePanel: ()=> void
}

export const DynamicPanelContext = createContext<DynamicPanelContextTs | undefined>(undefined)