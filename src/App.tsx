// import { Suspense, lazy } from 'react'
import { Router, Route } from './components/router'
import Tooltip from './components/shared/tooltip/Tooltip'
import DynamicPanel from './components/shared/panel/DynamicPanel'
import Navigator from './components/navigator/Navigator'
import HomePage from './pages/Home'
import ChatsLayout from './pages/chats/layout'
import Login from './pages/login/page'
import Register from './pages/register/page'
import About from './pages/about/page'
import Friends from './pages/friends/page'
import Me from './pages/me/page'
import Settings from './pages/settings/page'
import Terms from './pages/terms/page'
import Updates from './pages/updates/page'
import Welcome from './pages/welcome/page'

// const HomePage = lazy(()=> import('./pages/about/About'))

const routes = [
  {
    path: '/',
    component: HomePage
  },
  // {
  //   path: '/about',
  //   title: 'About',
  //   component: AboutLayout
  // },
]

function App() {

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Navigator />

        <Router routes={routes}>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />

          <Route path='/about' title='Sobre' component={About} />
          <Route path='/chats' title='Chats' component={ChatsLayout}  />
          <Route path='/friends' title='Amigos' component={Friends} />
          <Route path='/me' title='Yo' component={Me} />
          <Route path='/settings' component={Settings} />
          <Route path='/terms' title='Terminos' component={Terms} />
          <Route path='/updates' title='Actualizaciones' component={Updates} />
          <Route path='/welcome' title='Bienvenido' component={Welcome} />
        </Router>
        
        <Tooltip/>
        <DynamicPanel />
      {/* </Suspense> */}
    </>
  )
}

export default App
