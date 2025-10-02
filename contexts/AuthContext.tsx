import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface User {
  id: string
  fullName: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (fullName: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check for default credentials
      if (email === 'akinwumiolumide5@gmail.com' && password === '1234567') {
        const defaultUser: User = {
          id: 'default-user',
          fullName: 'Akinwumi Olumide',
          email: 'akinwumiolumide5@gmail.com',
        }
        setUser(defaultUser)
        await AsyncStorage.setItem('user', JSON.stringify(defaultUser))
        setIsLoading(false)
        return
      }

      // For demo purposes, we'll get user data from storage or create a mock user
      const storedUsers = await AsyncStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : []

      const existingUser = users.find((u: any) => u.email === email)
      if (existingUser) {
        setUser(existingUser)
        await AsyncStorage.setItem('user', JSON.stringify(existingUser))
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (fullName: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser: User = {
        id: Date.now().toString(),
        fullName,
        email,
      }

      // Store user in "database" (AsyncStorage for demo)
      const storedUsers = await AsyncStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      users.push(newUser)
      await AsyncStorage.setItem('users', JSON.stringify(users))

      // Set current user
      setUser(newUser)
      await AsyncStorage.setItem('user', JSON.stringify(newUser))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user')
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
