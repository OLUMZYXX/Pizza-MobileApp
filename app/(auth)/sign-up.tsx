import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to main app after sign up
      router.replace('/(tabs)')
    }, 1500)
  }

  const handleSignIn = () => {
    router.push('/(auth)/sign-in')
  }

  return (
    <View className='flex-1 bg-transparent'>
      {/* Rounded Form Container - Blends with background at top */}
      <View className='flex-1 bg-transparent rounded-t-[50px] px-6 pt-6 pb-8 -mt-8'>
        {/* Header Section - Now inside the form container */}
        <View className='mb-6 bg-transparent'>
          <View className='mb-1'>
            <Text className='text-3xl font-quicksand-bold leading-tight'>
              <Text className='text-dark-100'>Create </Text>
              <Text className='text-primary'>Account ✨</Text>
            </Text>
          </View>
          <Text className='text-sm font-quicksand-medium text-gray-500'>
            Join us and start your delicious journey
          </Text>
        </View>

        {/* Sign Up Form - Direct in transparent container */}
        <View className='w-full'>
          <View className='mb-3'>
            <CustomInput
              label='Full Name'
              placeholder='Enter your full name'
              value={form.fullName}
              onChangeText={(text) => setForm({ ...form, fullName: text })}
            />
          </View>

          <View className='mb-3'>
            <CustomInput
              label='Email Address'
              placeholder='your.email@example.com'
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              keyboardType='email-address'
            />
          </View>

          <View className='mb-3'>
            <CustomInput
              label='Password'
              placeholder='Enter your password'
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
            />
          </View>

          <View className='mb-2'>
            <CustomInput
              label='Confirm Password'
              placeholder='Confirm your password'
              value={form.confirmPassword}
              onChangeText={(text) =>
                setForm({ ...form, confirmPassword: text })
              }
              secureTextEntry
            />
          </View>

          {/* Terms and Conditions */}
          <View className='mb-6 mt-2'>
            <Text className='text-xs text-gray-500 font-quicksand-regular leading-relaxed'>
              By creating an account, you agree to our{' '}
              <Text className='text-primary font-quicksand-medium'>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text className='text-primary font-quicksand-medium'>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <CustomButton
            title='Create Account'
            onPress={handleSignUp}
            isLoading={isLoading}
            buttonStyle='mb-4'
          />

          {/* Sign In Link */}
          <View className='flex-row justify-center items-center'>
            <Text className='text-gray-500 font-quicksand-medium text-base'>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
              <Text className='text-primary font-quicksand-bold text-base'>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignUp
