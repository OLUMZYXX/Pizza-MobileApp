import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { images } from '@/constants'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PaymentMethods() {
  const [form, setForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (
      !form.cardNumber ||
      !form.expiryDate ||
      !form.cvv ||
      !form.cardholderName
    ) {
      Alert.alert('Error', 'Please fill in all card details')
      return
    }

    // Basic validation
    if (form.cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Please enter a valid card number')
      return
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) {
      Alert.alert('Error', 'Please enter expiry date in MM/YY format')
      return
    }

    if (form.cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV')
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would save the payment method securely
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert('Success', 'Payment method added successfully!')
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to add payment method')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '')
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted.substring(0, 19) // Limit to 16 digits + 3 spaces
  }

  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '')
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned.substring(0, 4)
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5 pt-5'>
        {/* Header */}
        <View className='flex-row items-center mb-6'>
          <TouchableOpacity onPress={() => router.back()} className='mr-4 p-2'>
            <Image
              source={images.arrowBack}
              className='size-5'
              resizeMode='contain'
              tintColor='#1a1a1a'
            />
          </TouchableOpacity>
          <Text className='text-2xl font-quicksand-bold text-dark-100'>
            Add Payment Method
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Card Preview */}
          <View className='mb-6 p-6 bg-gradient-to-r from-primary to-orange-400 rounded-2xl'>
            <View className='flex-row justify-between items-start mb-8'>
              <View>
                <Text className='text-white/80 text-sm font-quicksand-medium mb-1'>
                  Card Number
                </Text>
                <Text className='text-white text-lg font-quicksand-bold tracking-wider'>
                  {form.cardNumber || '•••• •••• •••• ••••'}
                </Text>
              </View>
              <Image
                source={images.dollar}
                className='size-8 opacity-80'
                resizeMode='contain'
                tintColor='white'
              />
            </View>

            <View className='flex-row justify-between'>
              <View>
                <Text className='text-white/80 text-xs font-quicksand-medium mb-1'>
                  Cardholder Name
                </Text>
                <Text className='text-white text-sm font-quicksand-medium'>
                  {form.cardholderName || 'YOUR NAME'}
                </Text>
              </View>
              <View>
                <Text className='text-white/80 text-xs font-quicksand-medium mb-1'>
                  Expiry
                </Text>
                <Text className='text-white text-sm font-quicksand-medium'>
                  {form.expiryDate || 'MM/YY'}
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View className='w-full'>
            <View className='mb-4'>
              <CustomInput
                label='Card Number'
                placeholder='1234 5678 9012 3456'
                value={form.cardNumber}
                onChangeText={(text) =>
                  setForm({ ...form, cardNumber: formatCardNumber(text) })
                }
                keyboardType='numeric'
                maxLength={19}
              />
            </View>

            <View className='flex-row gap-4 mb-4'>
              <View className='flex-1'>
                <CustomInput
                  label='Expiry Date'
                  placeholder='MM/YY'
                  value={form.expiryDate}
                  onChangeText={(text) =>
                    setForm({ ...form, expiryDate: formatExpiryDate(text) })
                  }
                  keyboardType='numeric'
                  maxLength={5}
                />
              </View>
              <View className='flex-1'>
                <CustomInput
                  label='CVV'
                  placeholder='123'
                  value={form.cvv}
                  onChangeText={(text) =>
                    setForm({
                      ...form,
                      cvv: text.replace(/\D/g, '').substring(0, 4),
                    })
                  }
                  keyboardType='numeric'
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View className='mb-6'>
              <CustomInput
                label='Cardholder Name'
                placeholder='John Doe'
                value={form.cardholderName}
                onChangeText={(text) =>
                  setForm({ ...form, cardholderName: text })
                }
                autoCapitalize='words'
              />
            </View>

            {/* Security Notice */}
            <View className='mb-6 p-4 bg-blue-50 rounded-xl'>
              <Text className='text-sm text-blue-800 font-quicksand-medium mb-2'>
                🔒 Secure Payment
              </Text>
              <Text className='text-xs text-blue-600 font-quicksand-regular'>
                Your payment information is encrypted and secure. We never store
                your CVV or full card details.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className='p-5 bg-white'>
          <CustomButton
            title='Add Payment Method'
            onPress={handleSave}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
