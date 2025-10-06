import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface CartItem {
  id: string
  item: any
  selectedToppings: string[]
  selectedSides: string[]
  quantity: number
  totalPrice: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (
    item: any,
    selectedToppings: string[],
    selectedSides: string[]
  ) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const saveCartToStorage = useCallback(async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart to storage:', error)
    }
  }, [cartItems])

  useEffect(() => {
    loadCartFromStorage()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage()
    }
  }, [cartItems, isLoading, saveCartToStorage])

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart')
      console.log('Loading cart from storage:', cartData)
      if (cartData) {
        const parsedData = JSON.parse(cartData)
        console.log('Parsed cart data:', parsedData)
        setCartItems(parsedData)
      } else {
        console.log('No cart data found in storage')
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = (
    item: any,
    selectedToppings: string[],
    selectedSides: string[]
  ) => {
    const basePrice = item.price
    const toppingsPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = item.toppings.find((t: any) => t.name === toppingName)
      return total + (topping?.price || 0)
    }, 0)
    const sidesPrice = selectedSides.reduce((total, sideName) => {
      const side = item.sides.find((s: any) => s.name === sideName)
      return total + (side?.price || 0)
    }, 0)
    const totalPrice = basePrice + toppingsPrice + sidesPrice

    const cartItemId = `${item.id}-${selectedToppings.sort().join('-')}-${selectedSides.sort().join('-')}`

    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === cartItemId)
      let newCartItems
      if (existingItem) {
        newCartItems = prev.map((cartItem) =>
          cartItem.id === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        newCartItems = [
          ...prev,
          {
            id: cartItemId,
            item,
            selectedToppings,
            selectedSides,
            quantity: 1,
            totalPrice,
          },
        ]
      }
      console.log('Added to cart, new cart items:', newCartItems)
      return newCartItems
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.totalPrice * item.quantity,
      0
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
    isLoading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
