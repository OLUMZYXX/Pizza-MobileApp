import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
  const { signUp } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    if (
      !form.fullName ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await signUp(form.fullName, form.username, form.email, form.password)
      router.replace('/(tabs)')
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Sign up failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    router.push('/(auth)/sign-in')
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['bottom']}>
      \n{' '}
      <ScrollView
        className='flex-1'
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        {/* Header Section */}
        <View className='mb-6'>
          <View className='mb-2'>
            <Text className='text-3xl font-quicksand-bold leading-tight'>
              <Text className='text-dark-100'>Create </Text>
              <Text className='text-primary'>Account ✨</Text>
            </Text>
          </View>
          <Text className='text-base font-quicksand-medium text-gray-500'>
            Join us and start your delicious journey
          </Text>
        </View>

        {/* Sign Up Form */}
        <View className='w-full flex-1'>
          <View className='mb-4'>
            <CustomInput
              label='Full Name'
              placeholder='Enter your full name'
              value={form.fullName}
              onChangeText={(text) => setForm({ ...form, fullName: text })}
            />
          </View>

          <View className='mb-4'>
            <CustomInput
              label='Username'
              placeholder='Choose a username'
              value={form.username}
              onChangeText={(text) => setForm({ ...form, username: text })}
            />
          </View>

          <View className='mb-4'>
            <CustomInput
              label='Email Address'
              placeholder='your.email@example.com'
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              keyboardType='email-address'
            />
          </View>

          <View className='mb-4'>
            <CustomInput
              label='Password'
              placeholder='Enter your password'
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry
            />
          </View>

          <View className='mb-3'>
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
          <View className='mb-6 mt-1'>
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
            buttonStyle='mb-5'
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
