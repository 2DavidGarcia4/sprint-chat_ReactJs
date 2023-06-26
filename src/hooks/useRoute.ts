import { useState, useEffect } from "react"

export function useRoute() {
  const [pathName, setPathName] = useState(window.location.pathname)

  useEffect(()=> {
    const onLocationChange = () => {
      setPathName(window.location.pathname)
    }

    window.addEventListener('pushstate', onLocationChange)
    window.addEventListener('popstate', onLocationChange)
    
    return () => {
      window.removeEventListener('pushstate', onLocationChange)
      window.removeEventListener('popstate', onLocationChange)

    }
  }, [])

  return {
    pathName
  }
}