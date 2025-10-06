import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export interface OrderItem {
  id: string
  item: any
  selectedToppings: string[]
  selectedSides: string[]
  quantity: number
  totalPrice: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  deliveryAddress: string
  phoneNumber: string
  specialInstructions?: string
  paymentMethod: 'card' | 'cash'
  subtotal: number
  deliveryFee: number
  tax: number
  totalAmount: number
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'on-the-way'
    | 'delivered'
    | 'cancelled'
  orderDate: string
  estimatedDelivery?: string
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => Promise<void>
  getOrderById: (orderId: string) => Order | undefined
  getUserOrders: (userId: string) => Order[]
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
  isLoading: boolean
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}

interface OrderProviderProps {
  children: ReactNode
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const saveOrdersToStorage = useCallback(async (ordersToSave: Order[]) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(ordersToSave))
    } catch (error) {
      console.error('Error saving orders to storage:', error)
    }
  }, [])

  useEffect(() => {
    loadOrdersFromStorage()
  }, [])

  const loadOrdersFromStorage = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orders')
      if (ordersData) {
        const parsedOrders = JSON.parse(ordersData)
        setOrders(parsedOrders)
      }
    } catch (error) {
      console.error('Error loading orders from storage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addOrder = async (
    orderData: Omit<Order, 'id' | 'orderDate' | 'status'>
  ) => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderDate: new Date().toISOString(),
        status: 'pending',
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
      }

      const updatedOrders = [newOrder, ...orders]
      setOrders(updatedOrders)
      await saveOrdersToStorage(updatedOrders)
    } catch (error) {
      console.error('Error adding order:', error)
      throw error
    }
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId)
  }

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter((order) => order.userId === userId)
  }

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status']
  ) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
      setOrders(updatedOrders)
      await saveOrdersToStorage(updatedOrders)
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  const value: OrderContextType = {
    orders,
    addOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    isLoading,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
