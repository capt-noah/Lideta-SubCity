/* eslint-disable react-refresh/only-export-components */
import BASE_URL from '../../utils/api'
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user,       setUser]       = useState(null)
  const [userToken,  setUserToken]  = useState(() => localStorage.getItem('userToken') || null)
  const [loadingUser,setLoadingUser]= useState(() => !!localStorage.getItem('userToken'))

  const logout = () => {
    localStorage.removeItem('userToken')
    setUserToken(null)
    setUser(null)
  }

  const login = (userData, token) => {
    localStorage.setItem('userToken', token)
    setUserToken(token)
    setUser(userData)
  }

  useEffect(() => {
    if (!userToken) { return }
    fetch(`${BASE_URL}/api/user/me`, { headers: { authorization: `Bearer ${userToken}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUser(data); else logout() })
      .catch(() => logout())
      .finally(() => setLoadingUser(false))
  }, [userToken])

  return (
    <UserContext.Provider value={{ user, userToken, loadingUser, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
