import { images } from '@/constants'
import { useCart } from '@/contexts/CartContext'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const CartButton = () => {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const handlePress = () => {
    router.push('/(tabs)/cart')
  }

  return (
    <TouchableOpacity className='cart-btn' onPress={handlePress}>
      <Image source={images.bag} className='size-5' resizeMode='contain' />
      {totalItems > 0 && (
        <View className='cart-badge'>
          <Text className='text-white text-xs font-quicksand-bold'>
            {totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default CartButton
