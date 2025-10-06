import { images } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'
import { Order, useOrders } from '@/contexts/OrderContext'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OrderHistory() {
  const { user } = useAuth()
  const { getUserOrders, isLoading } = useOrders()

  const userOrders = user ? getUserOrders(user.id) : []

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
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
  }

  const renderOrderItem = ({ item: order }: { item: Order }) => {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
    const firstItem = order.items[0]

    return (
      <TouchableOpacity
        className='bg-white rounded-2xl p-4 mb-4 mx-5'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        activeOpacity={0.7}
        onPress={() => router.push(`/profile/order-detail?orderId=${order.id}`)}
      >
        {/* Order Header */}
        <View className='flex-row justify-between items-start mb-3'>
          <View className='flex-1'>
            <Text className='text-base font-quicksand-bold text-dark-100 mb-1'>
              Order #{order.id.slice(-8).toUpperCase()}
            </Text>
            <Text className='text-sm font-quicksand-medium text-gray-500'>
              {formatDate(order.orderDate)}
            </Text>
          </View>
          <View
            className='px-3 py-1.5 rounded-full'
            style={{ backgroundColor: `${getStatusColor(order.status)}15` }}
          >
            <Text
              className='text-xs font-quicksand-semibold'
              style={{ color: getStatusColor(order.status) }}
            >
              {getStatusEmoji(order.status)}{' '}
              {order.status.charAt(0).toUpperCase() +
                order.status.slice(1).replace('-', ' ')}
            </Text>
          </View>
        </View>

        {/* Order Items Preview */}
        <View className='flex-row items-center mb-3'>
          {firstItem && (
            <Image
              source={firstItem.item.image}
              className='size-12 rounded-lg mr-3'
              resizeMode='cover'
            />
          )}
          <View className='flex-1'>
            <Text className='text-sm font-quicksand-semibold text-dark-100'>
              {firstItem?.item.title}
              {order.items.length > 1 && ` +${order.items.length - 1} more`}
            </Text>
            <Text className='text-xs text-gray-500 mt-1'>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className='h-px bg-gray-200 mb-3' />

        {/* Order Details */}
        <View className='flex-row justify-between items-center mb-2'>
          <View className='flex-row items-center flex-1'>
            <Image
              source={images.location}
              className='size-4 mr-2'
              tintColor='#999'
            />
            <Text
              className='text-xs font-quicksand-medium text-gray-600 flex-1'
              numberOfLines={1}
            >
              {order.deliveryAddress}
            </Text>
          </View>
        </View>

        <View className='flex-row justify-between items-center'>
          <View className='flex-row items-center'>
            <Text className='text-xl mr-1'>
              {order.paymentMethod === 'card' ? '💳' : '💵'}
            </Text>
            <Text className='text-xs font-quicksand-medium text-gray-600'>
              {order.paymentMethod.charAt(0).toUpperCase() +
                order.paymentMethod.slice(1)}
            </Text>
          </View>
          <Text className='text-lg font-quicksand-bold text-primary'>
            ${order.totalAmount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg text-gray-500'>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    )
  }

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
        <Text className='text-2xl font-quicksand-bold text-dark-100'>
          Order History
        </Text>
      </View>

      {userOrders.length === 0 ? (
        <View className='flex-1 justify-center items-center px-5'>
          <Image
            source={images.emptyState}
            className='size-48 mb-8'
            resizeMode='contain'
          />
          <Text className='h3-bold text-dark-100 mb-4 text-center'>
            No Orders Yet
          </Text>
          <Text className='paragraph-medium text-gray-500 text-center mb-8'>
            You haven&apos;t placed any orders yet. Start exploring our
            delicious menu!
          </Text>
          <TouchableOpacity
            className='bg-primary py-4 px-8 rounded-full'
            onPress={() => router.push('/(tabs)')}
          >
            <Text className='text-white font-quicksand-bold text-base'>
              Browse Menu
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}
