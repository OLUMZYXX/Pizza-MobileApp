import CustomAlert from '@/components/CustomAlert'
import { images } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useOrders } from '@/contexts/OrderContext'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Checkout() {
  const { user } = useAuth()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { addOrder } = useOrders()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.location || 'Nigeria'
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    confirmText: 'OK',
    onConfirm: () => {},
  })

  const deliveryFee = 5.0
  const tax = getTotalPrice() * 0.1 // 10% tax
  const totalAmount = getTotalPrice() + deliveryFee + tax

  const handlePlaceOrder = async () => {
    if (!phoneNumber) {
      setAlertConfig({
        visible: true,
        title: 'Missing Information',
        message: 'Please enter your phone number',
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setAlertConfig({ ...alertConfig, visible: false }),
      })
      return
    }

    if (!deliveryAddress) {
      setAlertConfig({
        visible: true,
        title: 'Missing Information',
        message: 'Please enter your delivery address',
        type: 'warning',
        confirmText: 'OK',
        onConfirm: () => setAlertConfig({ ...alertConfig, visible: false }),
      })
      return
    }

    if (!user) {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Please sign in to place an order',
        type: 'error',
        confirmText: 'OK',
        onConfirm: () => setAlertConfig({ ...alertConfig, visible: false }),
      })
      return
    }

    try {
      // Save order to history
      await addOrder({
        userId: user.id,
        items: cartItems,
        deliveryAddress,
        phoneNumber,
        specialInstructions,
        paymentMethod,
        subtotal: getTotalPrice(),
        deliveryFee,
        tax,
        totalAmount,
      })

      // Show success message
      setAlertConfig({
        visible: true,
        title: 'Order Placed! 🎉',
        message: `Your order of $${totalAmount.toFixed(2)} has been placed successfully. We'll deliver it to ${deliveryAddress} soon!`,
        type: 'success',
        confirmText: 'Great!',
        onConfirm: () => {
          setAlertConfig({ ...alertConfig, visible: false })
          clearCart()
          router.replace('/(tabs)')
        },
      })
    } catch {
      setAlertConfig({
        visible: true,
        title: 'Error',
        message: 'Failed to place order. Please try again.',
        type: 'error',
        confirmText: 'OK',
        onConfirm: () => setAlertConfig({ ...alertConfig, visible: false }),
      })
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-5 py-4 flex-row items-center'>
        <TouchableOpacity onPress={() => router.back()} className='mr-4'>
          <Image
            source={images.arrowBack}
            className='size-6'
            resizeMode='contain'
          />
        </TouchableOpacity>
        <Text className='text-2xl font-quicksand-bold text-dark-100'>
          Checkout
        </Text>
      </View>

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-3'>
            Delivery Address
          </Text>
          <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-3'>
            <Image
              source={images.location}
              className='size-5 mr-3'
              tintColor='#FF6B35'
            />
            <TextInput
              className='flex-1 text-base font-quicksand-medium text-dark-100'
              placeholder='Enter your delivery address'
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholderTextColor='#999'
            />
          </View>
        </View>

        {/* Contact Information */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-3'>
            Contact Information
          </Text>
          <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-3'>
            <Image
              source={images.phone}
              className='size-5 mr-3'
              tintColor='#FF6B35'
            />
            <TextInput
              className='flex-1 text-base font-quicksand-medium text-dark-100'
              placeholder='Phone number'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType='phone-pad'
              placeholderTextColor='#999'
            />
          </View>
          <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-3'>
            <Image
              source={images.envelope}
              className='size-5 mr-3'
              tintColor='#FF6B35'
            />
            <Text className='flex-1 text-base font-quicksand-medium text-dark-100'>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-3'>
            Payment Method
          </Text>
          <View className='flex-row gap-3'>
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-4 rounded-xl border-2 ${
                paymentMethod === 'card'
                  ? 'bg-primary/5 border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={() => setPaymentMethod('card')}
            >
              <Text className='text-2xl mr-2'>💳</Text>
              <Text
                className={`font-quicksand-semibold ${
                  paymentMethod === 'card' ? 'text-primary' : 'text-gray-500'
                }`}
              >
                Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center py-4 rounded-xl border-2 ${
                paymentMethod === 'cash'
                  ? 'bg-primary/5 border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text className='text-2xl mr-2'>💵</Text>
              <Text
                className={`font-quicksand-semibold ${
                  paymentMethod === 'cash' ? 'text-primary' : 'text-gray-500'
                }`}
              >
                Cash
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Instructions */}
        <View className='bg-white p-5 mb-4'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-3'>
            Special Instructions (Optional)
          </Text>
          <TextInput
            className='bg-gray-50 rounded-xl px-4 py-3 text-base font-quicksand-medium text-dark-100'
            placeholder='Add any special instructions for your order...'
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={4}
            textAlignVertical='top'
            placeholderTextColor='#999'
          />
        </View>

        {/* Order Summary */}
        <View className='bg-white p-5'>
          <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
            Order Summary
          </Text>

          {/* Items */}
          {cartItems.map((item) => (
            <View
              key={item.id}
              className='flex-row justify-between items-center mb-3'
            >
              <View className='flex-1'>
                <Text className='text-base font-quicksand-medium text-dark-100'>
                  {item.item.title} x {item.quantity}
                </Text>
                {(item.selectedToppings.length > 0 ||
                  item.selectedSides.length > 0) && (
                  <Text className='text-xs text-gray-500 mt-1'>
                    {[...item.selectedToppings, ...item.selectedSides].join(
                      ', '
                    )}
                  </Text>
                )}
              </View>
              <Text className='text-base font-quicksand-semibold text-dark-100'>
                ${(item.totalPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Divider */}
          <View className='h-px bg-gray-200 my-4' />

          {/* Price Breakdown */}
          <View className='flex-row justify-between items-center mb-2'>
            <Text className='text-base font-quicksand-medium text-gray-600'>
              Subtotal
            </Text>
            <Text className='text-base font-quicksand-medium text-dark-100'>
              ${getTotalPrice().toFixed(2)}
            </Text>
          </View>
          <View className='flex-row justify-between items-center mb-2'>
            <Text className='text-base font-quicksand-medium text-gray-600'>
              Delivery Fee
            </Text>
            <Text className='text-base font-quicksand-medium text-dark-100'>
              ${deliveryFee.toFixed(2)}
            </Text>
          </View>
          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-base font-quicksand-medium text-gray-600'>
              Tax (10%)
            </Text>
            <Text className='text-base font-quicksand-medium text-dark-100'>
              ${tax.toFixed(2)}
            </Text>
          </View>

          {/* Divider */}
          <View className='h-px bg-gray-200 mb-4' />

          {/* Total */}
          <View className='flex-row justify-between items-center'>
            <Text className='text-xl font-quicksand-bold text-dark-100'>
              Total
            </Text>
            <Text className='text-2xl font-quicksand-bold text-primary'>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View className='absolute bottom-0 left-0 right-0 bg-white p-5'>
        <TouchableOpacity
          className='bg-primary py-4 rounded-full items-center'
          onPress={handlePlaceOrder}
        >
          <Text className='text-white font-quicksand-bold text-lg'>
            Place Order (${totalAmount.toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        onConfirm={alertConfig.onConfirm}
      />
    </SafeAreaView>
  )
}
