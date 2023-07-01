import React, { useRef, type ReactNode, Children, isValidElement } from 'react'
import { match } from 'path-to-regexp'
import { useRoute } from '@/hooks';
import type { RouteParams } from '@/utils/types';

function defaultError() {
  return (
    <h1>404</h1>
  )
}

interface Route {
  path: string
  title?: string
  component: React.LazyExoticComponent<(props: object) => JSX.Element> | ((props: object) => JSX.Element)
}

export function Router({children, routes, rootPath}: {
  children: ReactNode
  routes?: Route[]
  rootPath?: string
}){
  const { pathName } = useRoute()
  const defaultTitle = useRef(document.title)

  let routeParams = {}

  let routesFromChildren: Route[] = []

  if(children != undefined){
    routesFromChildren = Children.map(children, (child: ReactNode)=> {
      if(isValidElement(child)){
        const { name } = child.type as {name: string}
        const isRoute = name == 'Route'
    
        return isRoute ? child.props : null
      }else return null

    }) || []
  }

  const route = routesFromChildren.concat(routes || []).find(({path})=> {
    path = (rootPath || '')+path
    if(rootPath ? path == pathName : pathName.startsWith(path)) return true

    const matcherUrl = match(path, {
      decode: decodeURIComponent
    })
    const matched = matcherUrl(pathName)
    if(!matched) return false

    routeParams = matched.params
    return true
  })

  if(!defaultTitle.current.includes('|')){
    if(route?.title) document.title = `${defaultTitle.current} | ${route.title}`
    else if(document.title != defaultTitle.current) document.title = defaultTitle.current
  }

  const Page: React.FC<{routeParams: RouteParams}> = route?.component ||  defaultError

  return <Page routeParams={routeParams} />
}