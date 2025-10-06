import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
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
  username: string
  email: string
  profileImage?: string
  location?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    fullName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>
  signOut: () => Promise<void>
  biometricSignIn: () => Promise<void>
  isBiometricAvailable: () => Promise<boolean>
  updateUser: (userData: Partial<User>) => Promise<void>
  deleteAccount: () => Promise<void>
  updateLocation: (location: string) => Promise<void>
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
          username: 'akinwumi',
          email: 'akinwumiolumide5@gmail.com',
          location: 'Nigeria',
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

  const signUp = async (
    fullName: string,
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser: User = {
        id: Date.now().toString(),
        fullName,
        username,
        email,
        location: 'Nigeria', // Default location
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

  const isBiometricAvailable = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      return hasHardware && isEnrolled
    } catch (error) {
      console.error('Error checking biometric availability:', error)
      return false
    }
  }

  const biometricSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to sign in',
        fallbackLabel: 'Use password',
      })

      if (result.success) {
        // Check if there's a stored user (last signed in user)
        const storedUser = await AsyncStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } else {
          throw new Error(
            'No previous user found. Please sign in with email and password first.'
          )
        }
      } else {
        throw new Error('Biometric authentication failed')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser))

      // Also update in users list
      const storedUsers = await AsyncStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      const userIndex = users.findIndex((u: User) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        await AsyncStorage.setItem('users', JSON.stringify(users))
      }
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      if (!user) return

      // Remove user from users list
      const storedUsers = await AsyncStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      const filteredUsers = users.filter((u: User) => u.id !== user.id)
      await AsyncStorage.setItem('users', JSON.stringify(filteredUsers))

      // Remove current user
      await AsyncStorage.removeItem('user')
      setUser(null)
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  const updateLocation = async (location: string) => {
    try {
      await updateUser({ location })
    } catch (error) {
      console.error('Error updating location:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    biometricSignIn,
    isBiometricAvailable,
    updateUser,
    deleteAccount,
    updateLocation,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
