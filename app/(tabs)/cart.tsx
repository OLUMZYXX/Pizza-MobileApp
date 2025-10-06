import CustomAlert from '@/components/CustomAlert'
import { images } from '@/constants'
import { useCart } from '@/contexts/CartContext'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    isLoading,
  } = useCart()

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'warning' as 'success' | 'error' | 'warning' | 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    onConfirm: () => {},
    onCancel: () => {},
  })

  useEffect(() => {
    console.log('Cart items updated:', cartItems)
  }, [cartItems])

  console.log('Cart page rendered with cartItems:', cartItems)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setAlertConfig({
        visible: true,
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?',
        type: 'warning',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        showCancel: true,
        onConfirm: () => {
          removeFromCart(id)
          setAlertConfig({ ...alertConfig, visible: false })
        },
        onCancel: () => {
          setAlertConfig({ ...alertConfig, visible: false })
        },
      })
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleRemoveItem = (id: string) => {
    setAlertConfig({
      visible: true,
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      type: 'warning',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        removeFromCart(id)
        setAlertConfig({ ...alertConfig, visible: false })
      },
      onCancel: () => {
        setAlertConfig({ ...alertConfig, visible: false })
      },
    })
  }

  const handleCheckout = () => {
    setAlertConfig({
      visible: true,
      title: 'Checkout',
      message: 'Checkout functionality coming soon!',
      type: 'info',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: false,
      onConfirm: () => {
        setAlertConfig({ ...alertConfig, visible: false })
      },
      onCancel: () => {},
    })
  }

  const renderCartItem = ({ item }: { item: any }) => (
    <View className='bg-white rounded-2xl p-4 mb-4 shadow-sm'>
      {/* Item Header */}
      <View className='flex-row items-center mb-3'>
        <Image
          source={item.item.image}
          className='size-16 rounded-xl mr-3'
          resizeMode='cover'
        />
        <View className='flex-1'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-1'>
            {item.item.title}
          </Text>
          <Text className='text-sm text-gray-500'>
            ${item.item.price.toFixed(2)} each
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)}
          className='p-2'
        >
          <Image source={images.trash} className='size-5' tintColor='#EF4444' />
        </TouchableOpacity>
      </View>

      {/* Customizations */}
      {(item.selectedToppings.length > 0 || item.selectedSides.length > 0) && (
        <View className='mb-3'>
          {item.selectedToppings.length > 0 && (
            <View className='mb-2'>
              <Text className='text-sm font-quicksand-semibold text-gray-700 mb-1'>
                Toppings:
              </Text>
              <Text className='text-sm text-gray-600'>
                {item.selectedToppings.join(', ')}
              </Text>
            </View>
          )}
          {item.selectedSides.length > 0 && (
            <View>
              <Text className='text-sm font-quicksand-semibold text-gray-700 mb-1'>
                Sides:
              </Text>
              <Text className='text-sm text-gray-600'>
                {item.selectedSides.join(', ')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Quantity and Price */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            className='bg-primary rounded-full w-8 h-8 items-center justify-center mr-3'
          >
            <Text className='text-lg font-quicksand-bold text-white'>-</Text>
          </TouchableOpacity>
          <Text className='text-lg font-quicksand-bold text-dark-100 mx-3'>
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            className='bg-primary rounded-full w-8 h-8 items-center justify-center ml-3'
          >
            <Text className='text-lg font-quicksand-bold text-white'>+</Text>
          </TouchableOpacity>
        </View>
        <Text className='text-lg font-quicksand-bold text-primary'>
          ${(item.totalPrice * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  )

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-lg text-gray-500'>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className='flex-1'>
        <View className='flex-1 justify-center items-center px-5'>
          <Image
            source={images.emptyState}
            className='size-48 mb-8'
            resizeMode='contain'
          />
          <Text className='h3-bold text-dark-100 mb-4 text-center'>
            Your cart is empty
          </Text>
          <Text className='paragraph-medium text-gray-500 text-center'>
            Add some delicious items to your cart to get started!
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-5 py-4'>
        <Text className='text-2xl font-quicksand-bold text-dark-100'>
          Your Cart
        </Text>
        <Text className='text-sm text-gray-500 mt-1'>
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your
          cart
        </Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Section */}
      <View className='bg-white p-5 mb-24'>
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100'>
            Total
          </Text>
          <Text className='text-2xl font-quicksand-bold text-primary'>
            ${getTotalPrice().toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          className='bg-primary py-4 rounded-full items-center'
          onPress={handleCheckout}
        >
          <Text className='text-white font-quicksand-bold text-lg'>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </SafeAreaView>
  )
}
