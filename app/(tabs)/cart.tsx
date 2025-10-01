import { images } from '@/constants'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Cart() {
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
