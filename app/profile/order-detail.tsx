import { images } from '@/constants'
import { Order, useOrders } from '@/contexts/OrderContext'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OrderDetail() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<Order | undefined>(undefined)

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId)
      setOrder(foundOrder)
    }
  }, [orderId, getOrderById])

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#FFA500'
      case 'confirmed':
        return '#4169E1'
      case 'preparing':
        return '#FF6B35'
      case 'on-the-way':
        return '#9370DB'
      case 'delivered':
        return '#2E8B57'
      case 'cancelled':
        return '#DC143C'
      default:
        return '#999'
    }
  }

  const getStatusEmoji = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'confirmed':
        return '✅'
      case 'preparing':
        return '👨‍🍳'
      case 'on-the-way':
        return '🚚'
      case 'delivered':
        return '🎉'
      case 'cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatEstimatedDelivery = (dateString?: string) => {
    if (!dateString) return 'Calculating...'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDeliveryProgress = (status: Order['status']): number => {
    switch (status) {
      case 'pending':
        return 0
      case 'confirmed':
        return 25
      case 'preparing':
        return 50
      case 'on-the-way':
        return 75
      case 'delivered':
        return 100
      case 'cancelled':
        return 0
      default:
        return 0
    }
  }

  if (!order) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg text-gray-500'>Order not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const progress = getDeliveryProgress(order.status)

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-5 py-4 flex-row items-center mb-4'>
        <TouchableOpacity onPress={() => router.back()} className='mr-4'>
          <Image
            source={images.arrowBack}
            className='size-6'
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View className='flex-1'>
          <Text className='text-2xl font-quicksand-bold text-dark-100'>
            Order Details
          </Text>
          <Text className='text-sm font-quicksand-medium text-gray-500 mt-1'>
            #{order.id.slice(-8).toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Map */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-3'>
            Delivery Tracking 🚚
          </Text>

          {/* Interactive Map */}
          <View
            className='rounded-2xl overflow-hidden mb-4'
            style={{ height: 250 }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 9.082, // Lagos, Nigeria (delivery location)
                longitude: 8.6753,
                latitudeDelta: 35,
                longitudeDelta: 35,
              }}
              mapType='standard'
            >
              {/* Restaurant Marker */}
              <Marker
                coordinate={{
                  latitude: 40.7128, // New York (Restaurant)
                  longitude: -74.006,
                }}
                title='Restaurant'
                description='Food Preparation Location'
                pinColor='red'
              >
                <View className='items-center'>
                  <View className='bg-red-500 rounded-full p-2'>
                    <Text className='text-2xl'>🍕</Text>
                  </View>
                </View>
              </Marker>

              {/* Delivery Location Marker */}
              <Marker
                coordinate={{
                  latitude: 9.082, // Lagos, Nigeria
                  longitude: 8.6753,
                }}
                title='Delivery Location'
                description={order.deliveryAddress}
                pinColor='green'
              >
                <View className='items-center'>
                  <View className='bg-green-500 rounded-full p-2'>
                    <Text className='text-2xl'>📍</Text>
                  </View>
                </View>
              </Marker>

              {/* Delivery Route Line */}
              <Polyline
                coordinates={[
                  { latitude: 40.7128, longitude: -74.006 }, // Restaurant
                  { latitude: 9.082, longitude: 8.6753 }, // Delivery Location
                ]}
                strokeColor='#FF6B35'
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />

              {/* Delivery Driver Marker (if on the way) */}
              {order.status === 'on-the-way' && (
                <Marker
                  coordinate={{
                    latitude: 25, // Midpoint (simulated driver location)
                    longitude: -30,
                  }}
                  title='Delivery Driver'
                  description='Your order is on the way!'
                  pinColor='blue'
                >
                  <View className='items-center'>
                    <View className='bg-blue-500 rounded-full p-2'>
                      <Text className='text-2xl'>🚚</Text>
                    </View>
                  </View>
                </Marker>
              )}
            </MapView>
          </View>

          {/* Delivery Progress */}
          <View className='mb-4'>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm font-quicksand-semibold text-dark-100'>
                Delivery Progress
              </Text>
              <Text className='text-sm font-quicksand-semibold text-primary'>
                {progress}%
              </Text>
            </View>
            <View className='h-2 bg-gray-200 rounded-full overflow-hidden'>
              <View
                className='h-full bg-primary rounded-full'
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          {/* Status and ETA */}
          <View className='flex-row items-center justify-between'>
            <View
              className='flex-1 px-4 py-3 rounded-xl mr-2'
              style={{ backgroundColor: `${getStatusColor(order.status)}15` }}
            >
              <Text className='text-xs font-quicksand-medium text-gray-600 mb-1'>
                Status
              </Text>
              <Text
                className='text-sm font-quicksand-bold'
                style={{ color: getStatusColor(order.status) }}
              >
                {getStatusEmoji(order.status)}{' '}
                {order.status.charAt(0).toUpperCase() +
                  order.status.slice(1).replace('-', ' ')}
              </Text>
            </View>
            <View className='flex-1 px-4 py-3 rounded-xl bg-green-50 ml-2'>
              <Text className='text-xs font-quicksand-medium text-gray-600 mb-1'>
                Est. Arrival
              </Text>
              <Text className='text-sm font-quicksand-bold text-green-700'>
                ⏰ {formatEstimatedDelivery(order.estimatedDelivery)}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
            Order Items ({itemCount})
          </Text>

          {order.items.map((item, index) => (
            <View key={item.id}>
              <View className='flex-row mb-4'>
                <Image
                  source={item.item.image}
                  className='size-20 rounded-xl mr-4'
                  resizeMode='cover'
                />
                <View className='flex-1'>
                  <Text className='text-base font-quicksand-bold text-dark-100 mb-1'>
                    {item.item.title}
                  </Text>
                  <Text className='text-sm font-quicksand-medium text-gray-500 mb-2'>
                    ${item.item.price.toFixed(2)} each
                  </Text>

                  {/* Toppings */}
                  {item.selectedToppings.length > 0 && (
                    <View className='mb-2'>
                      <Text className='text-xs font-quicksand-semibold text-gray-700 mb-1'>
                        Toppings:
                      </Text>
                      <Text className='text-xs font-quicksand-medium text-gray-600'>
                        {item.selectedToppings.join(', ')}
                      </Text>
                    </View>
                  )}

                  {/* Sides */}
                  {item.selectedSides.length > 0 && (
                    <View className='mb-2'>
                      <Text className='text-xs font-quicksand-semibold text-gray-700 mb-1'>
                        Sides:
                      </Text>
                      <Text className='text-xs font-quicksand-medium text-gray-600'>
                        {item.selectedSides.join(', ')}
                      </Text>
                    </View>
                  )}

                  <View className='flex-row justify-between items-center'>
                    <Text className='text-sm font-quicksand-medium text-gray-600'>
                      Qty: {item.quantity}
                    </Text>
                    <Text className='text-base font-quicksand-bold text-primary'>
                      ${(item.totalPrice * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {index < order.items.length - 1 && (
                <View className='h-px bg-gray-200 mb-4' />
              )}
            </View>
          ))}
        </View>

        {/* Delivery Details */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
            Delivery Details
          </Text>

          <View className='flex-row items-start mb-3'>
            <Image
              source={images.location}
              className='size-5 mr-3 mt-0.5'
              tintColor='#FF6B35'
            />
            <View className='flex-1'>
              <Text className='text-xs font-quicksand-medium text-gray-500 mb-1'>
                Delivery Address
              </Text>
              <Text className='text-base font-quicksand-semibold text-dark-100'>
                {order.deliveryAddress}
              </Text>
            </View>
          </View>

          <View className='flex-row items-start mb-3'>
            <Image
              source={images.phone}
              className='size-5 mr-3 mt-0.5'
              tintColor='#FF6B35'
            />
            <View className='flex-1'>
              <Text className='text-xs font-quicksand-medium text-gray-500 mb-1'>
                Phone Number
              </Text>
              <Text className='text-base font-quicksand-semibold text-dark-100'>
                {order.phoneNumber}
              </Text>
            </View>
          </View>

          <View className='flex-row items-start mb-3'>
            <Text className='text-xl mr-3'>
              {order.paymentMethod === 'card' ? '💳' : '💵'}
            </Text>
            <View className='flex-1'>
              <Text className='text-xs font-quicksand-medium text-gray-500 mb-1'>
                Payment Method
              </Text>
              <Text className='text-base font-quicksand-semibold text-dark-100'>
                {order.paymentMethod.charAt(0).toUpperCase() +
                  order.paymentMethod.slice(1)}
              </Text>
            </View>
          </View>

          {order.specialInstructions && (
            <View className='flex-row items-start'>
              <Text className='text-xl mr-3'>📝</Text>
              <View className='flex-1'>
                <Text className='text-xs font-quicksand-medium text-gray-500 mb-1'>
                  Special Instructions
                </Text>
                <Text className='text-base font-quicksand-medium text-dark-100'>
                  {order.specialInstructions}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
            Payment Summary
          </Text>

          <View className='flex-row justify-between items-center mb-2'>
            <Text className='text-base font-quicksand-medium text-gray-600'>
              Subtotal
            </Text>
            <Text className='text-base font-quicksand-medium text-dark-100'>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>

          <View className='flex-row justify-between items-center mb-2'>
            <Text className='text-base font-quicksand-medium text-gray-600'>
              Delivery Fee
            </Text>
            <Text className='text-base font-quicksand-medium text-dark-100'>
              ${order.deliveryFee.toFixed(2)}
            </Text>
          </View>

          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-base font-quicksand-medium text-gray-600'>
              Tax (10%)
            </Text>
            <Text className='text-base font-quicksand-medium text-dark-100'>
              ${order.tax.toFixed(2)}
            </Text>
          </View>

          <View className='h-px bg-gray-200 mb-4' />

          <View className='flex-row justify-between items-center'>
            <Text className='text-xl font-quicksand-bold text-dark-100'>
              Total
            </Text>
            <Text className='text-2xl font-quicksand-bold text-primary'>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Order Date */}
        <View className='bg-white p-5 mb-4'>
          <View className='flex-row items-center'>
            <Image
              source={images.clock}
              className='size-5 mr-3'
              tintColor='#999'
            />
            <View className='flex-1'>
              <Text className='text-xs font-quicksand-medium text-gray-500 mb-1'>
                Order Placed
              </Text>
              <Text className='text-base font-quicksand-semibold text-dark-100'>
                {formatDate(order.orderDate)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
