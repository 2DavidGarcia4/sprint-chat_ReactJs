import { Tooltip } from "../contexts"
import { API_ENDPOINT, STORAGE_KEYS } from "./data"
import { FriendRequest } from "./types"
import { socket } from "./socket"


export function navigate(href: string) {
  window.history.pushState({}, '', href)
  const navigationEvent = new Event('pushstate')
  window.dispatchEvent(navigationEvent)
}

export const transformText = (text: string) => {
  text = text.replace(/> /g, ``)

  if(text.includes('**')){
    const sep = text.split('**')
    if(sep.length % 2 != 0){
      text = sep.map((m, i) => i+1 == sep.length ? m : i%2 ? m+'</strong>' : m+'<strong>').join('')
    }
  }
  
  if(text.includes('*')){
    const sep = text.split('*')
    if(sep.length % 2 != 0){
      text = sep.map((m, i) => i+1 == sep.length ? m : i%2 ? m+'</em>' : m+'<em>').join('')
    }
  }

  text = text.split(' ').map(m=> {
    if(m.includes('http')){
      const start = m.indexOf('http')
      const preLink = m.slice(start, m.length)
      const end = (preLink.includes('<') ? preLink.indexOf('<') : preLink.length)+start
      const link = m.slice(start, end)

      return `${start == 0 ? '' : m.slice(0, start)}<a href="${link}" target="_blank">${link}</a>`+m.slice(end, m.length)
    }else return m
  }).join(' ')

  return text
}

export async function customFetch(route: string, method='GET', body?: Object) {
  if(typeof localStorage != 'undefined'){
    const token = localStorage.getItem(STORAGE_KEYS.token)

    return fetch(API_ENDPOINT+route, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(prom=> prom.status == 204 ? undefined : prom.json())
  }
  return {message: 'No client'}
}

export function setTooltipPosition(tooltip: Tooltip, element: HTMLDivElement) {
  const { innerWidth, innerHeight } = window
  const pdd = 10, ed = 20

  if(innerWidth <= 500) return
  // console.log(thisRef)

  const hHalf = (tooltip.rect.height/2)
  const wHalf = (tooltip.rect.width/2) 
  let y = tooltip.rect.top+hHalf
  let x = tooltip.rect.left+wHalf

  const rect = element.getBoundingClientRect()
  const thHalf = rect.height/2
  const thWalf = rect.width/2

  const firstChild = element.childNodes.item(0) as HTMLDivElement
  const arrowRect = firstChild.getBoundingClientRect()
  
  let aY = 0
  let aX = 0

  if(tooltip.direction == 'top'){
    y-=hHalf+rect.height+ed
    x-=thWalf
  }
  
  if(tooltip.direction == 'bottom'){
    y+=hHalf+ed
    x-=thWalf

  }

  if(tooltip.direction == 'left'){
    y-=thHalf
    x-=rect.width+ed

  }

  if(tooltip.direction == 'right'){
    y+=hHalf+ed
    x+=rect.width+ed

  }

  
  aX = (thWalf-arrowRect.width/2)

  if(x < pdd) {
    aX = (aX-((-x)+pdd))
    
    x=pdd
  }

  if(x+rect.width > innerWidth-pdd) {
    aX = (aX+(x+rect.width - (innerWidth-pdd)))

    x-= x+rect.width - (innerWidth-pdd)
  }

  element.style.top = y+'px'
  element.style.left = x+'px'
  // firstChild.style.top = aY ? aY+'px' : ''
  firstChild.style.left = aX ? aX+'px' : ''
}

export function emitFriendRequestCreate(newRequest: FriendRequest) {
  socket.emit('friendRequestCreate', newRequest)
}

export function handleHeight(firstElement: HTMLElement | null, lastElement: HTMLElement | null, paddding=0) {
  if(firstElement && lastElement){
    firstElement.style.height = (lastElement.clientHeight || 0) + paddding + 'px'
  }
}