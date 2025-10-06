import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'

const SignIn = () => {
  const { signIn, biometricSignIn, isBiometricAvailable } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [biometricSupported, setBiometricSupported] = useState(false)

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const supported = await isBiometricAvailable()
      setBiometricSupported(supported)
    }
    checkBiometricSupport()
  }, [isBiometricAvailable])

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      await signIn(form.email, form.password)
      router.replace('/(tabs)')
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Sign in failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = () => {
    router.push('/(auth)/sign-up')
  }

  const handleBiometricSignIn = async () => {
    try {
      await biometricSignIn()
      router.replace('/(tabs)')
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Biometric sign in failed'
      )
    }
  }

  return (
    <View className='flex-1 bg-transparent'>
      {/* Rounded Form Container - Blends with background at top */}
      <View className='flex-1 bg-transparent rounded-t-[50px] px-6 pt-6 pb-8 -mt-8'>
        {/* Header Section - Now inside the form container */}
        <View className='mb-6 bg-transparent'>
          <View className='mb-1'>
            <Text className='text-3xl font-quicksand-bold leading-tight'>
              <Text className='text-dark-100'>Welcome </Text>
              <Text className='text-primary'>Back! 👋</Text>
            </Text>
          </View>
          <Text className='text-sm font-quicksand-medium text-gray-500'>
            Sign in to continue your culinary journey
          </Text>
        </View>

        {/* Sign In Form - Direct in transparent container */}
        <View className='w-full'>
          <View className='mb-4'>
            <CustomInput
              label='Email Address'
              placeholder='your.email@example.com'
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              keyboardType='email-address'
            />
          </View>

          <View className='mb-2'>
            <CustomInput
              label='Password'
              placeholder='Enter your password'
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className='self-end mb-6' activeOpacity={0.7}>
            <Text className='text-primary font-quicksand-semibold text-sm'>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <CustomButton
            title='Sign In'
            onPress={handleSignIn}
            isLoading={isLoading}
            buttonStyle='mb-4'
          />

          {/* Biometric Sign In */}
          {biometricSupported && (
            <>
              <View className='flex-row items-center mb-4'>
                <View className='flex-1 h-px bg-gray-300' />
                <Text className='mx-4 text-gray-500 font-quicksand-medium'>
                  or
                </Text>
                <View className='flex-1 h-px bg-gray-300' />
              </View>
              <CustomButton
                title='Sign In with Biometrics'
                onPress={handleBiometricSignIn}
                isLoading={false}
                variant='secondary'
                buttonStyle='mb-4'
              />
            </>
          )}

          {/* Sign Up Link */}
          <View className='flex-row justify-center items-center mt-auto'>
            <Text className='text-gray-500 font-quicksand-medium text-base'>
              Don&apos;t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
              <Text className='text-primary font-quicksand-bold text-base'>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignIn
