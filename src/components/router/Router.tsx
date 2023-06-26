import { useRef, ReactNode, Children } from 'react'
import { match } from 'path-to-regexp'
import { RouteParams } from '../../utils/types';
import { useRoute } from '@/hooks';

function defaultError() {
  return (
    <h1>404</h1>
  )
}

// const defaultTitle = document.title

interface Route {
  path: string
  title?: string
  component: React.LazyExoticComponent<(props: any) => JSX.Element> | ((props: any) => JSX.Element)
}

export function Router({children, routes, rootPath}: {
  children: ReactNode
  routes?: Route[]
  rootPath?: string
}){
  const { pathName } = useRoute()
  const defaultTitle = useRef(document.title)
  // console.log({children})
  // console.log({defaultTitle: defaultTitle.current})

  let routeParams = {}

  const routesFromChildren: Route[] = Children.map(children, ({type: {name}, props}: any)=> {
    const isRoute = name == 'Route'

    return isRoute ? props : null
  }) || []
  // console.log(routesFromChildren)

  const route = routesFromChildren.concat(routes || []).find(({path})=> {
    path = (rootPath || '')+path
    // console.log({path, pathName})
    if(rootPath ? path == pathName : pathName.startsWith(path)) return true

    const matcherUrl = match(path, {
      decode: decodeURIComponent
    })
    const matched = matcherUrl(pathName)
    if(!matched) return false

    routeParams = matched.params
    return true
  })

  if(route?.title) document.title = `${defaultTitle.current} | ${route.title}`
  else if(document.title != defaultTitle.current) document.title = defaultTitle.current

  const Page: React.FC<{routeParams: RouteParams}> = route?.component ||  defaultError

  return <Page routeParams={routeParams} />
}