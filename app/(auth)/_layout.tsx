import { images } from '@/constants'
import { Slot, usePathname } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
} from 'react-native'

export default function AuthLayout() {
  const pathname = usePathname()
  const isSignUp = pathname.includes('sign-up')

  const backgroundImage = isSignUp ? images.signup : images.loginGraphic
  return (
    <View className='flex-1'>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1'>
          {/* Background Image Section - Fixed height */}
          <View
            className='w-full relative'
            style={{
              height: Dimensions.get('screen').height * 0.35,
              marginTop: -(StatusBar.currentHeight || 0),
            }}
          >
            <ImageBackground
              source={backgroundImage}
              className='size-full'
              resizeMode='cover'
            />
          </View>

          {/* Auth Content Section - White rounded container */}
          <View className='flex-1 bg-white rounded-t-[40px] -mt-8'>
            <Slot />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
