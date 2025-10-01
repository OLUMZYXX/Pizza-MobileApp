import { images } from '@/constants'
import { Slot, usePathname } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
        <ScrollView
          className='flex-1'
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Background Image Section - Full screen from top */}
          <View
            className='w-full relative'
            style={{
              height: Dimensions.get('screen').height / 3,
              marginTop: -(StatusBar.currentHeight || 0),
            }}
          >
            <ImageBackground
              source={backgroundImage}
              className='size-full'
              resizeMode='cover'
            />
            {/* Logo removed as requested */}
          </View>

          {/* Auth Content Section */}
          <SafeAreaView className='bg-transparent'>
            <View className='flex-1 px-5 pt-8 bg-transparent'>
              <Slot />
            </View>
          </SafeAreaView>
          {/* <CustomInput
            placeholder='Enter your email'
            value=''
            onChangeText={() => {}}
            label='Email'
            keyboardType='email-address'
          /> */}
          {/* <CustomButton /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
