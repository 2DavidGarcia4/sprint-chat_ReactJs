import { useContext, type MouseEvent } from 'react'
import { TooltipContext, type Tooltip, type TooltipContextTs, type TooltipOption } from "@/contexts"

export function useTooltip() {
  const { setTooltip, tooltip } = useContext(TooltipContext) as TooltipContextTs

  const createTooltip = ({currentTarget}: MouseEvent<HTMLElement>) => {
    if(tooltip?.options) return
    const { innerWidth } = window
    if(innerWidth <= 700) return
    const rect = currentTarget.getBoundingClientRect()

    setTooltip({
      rect,
      content: currentTarget.dataset.name || 'undefined',
      direction: (currentTarget.dataset.direction || 'top') as Tooltip['direction'],
    })
  }

  const deleteTooltip = () => {
    setTooltip(undefined)
  }

  const createTooltipOptions = ({currentTarget}: MouseEvent<HTMLElement>, options: TooltipOption[]) => {
    if(tooltip?.options) return setTooltip(undefined)
    const rect = currentTarget.getBoundingClientRect()

    options.forEach(o=> {
      const fn = o.function
      o.function = () => {
        fn()
        
      }
    })

    setTooltip({
      rect,
      content: 'undefined',
      direction: (currentTarget.dataset.direction || 'top') as Tooltip['direction'],
      options
    })
  } 

  return {
    tooltip,
    createTooltip,
    deleteTooltip,
    createTooltipOptions,
    events: {
      onMouseEnter: createTooltip,
      onMouseLeave() {
        if(tooltip?.options) return
        deleteTooltip()
      }
    }
  }
}