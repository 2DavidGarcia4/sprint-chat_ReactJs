export const API_URL = 'http://localhost:2004'
export const API_ENDPOINT = API_URL+'/api/v1/'

export const statusTypes = {
  '0': 'offline',
  '1': 'online',
  '2': 'idle',
  '3': 'dnd',
  '4': 'say'
}

export const appRoutes = ['/chats', '/me', '/friends', '/settings']
export const oterRoutes = ['/login', '/register']