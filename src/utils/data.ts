export const API_URL = 'http://localhost:2004'
export const API_ENDPOINT = API_URL+'/api/v1/'

export const STATUS_NAMES = {
  '0': 'Desconectado',
  '1': 'Conectado',
  '2': 'Ausente',
  '3': 'No molestar',
  '4': 'say'
} as const

export const APP_ROUTES = ['/chats', '/me', '/friends', '/settings']
export const OTER_PATHS = ['/login', '/register']

export const STORAGE_KEYS = {
  token: 'secret',
  status: 'defaultStatus'
} as const