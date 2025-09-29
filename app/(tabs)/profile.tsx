import { images } from '@/constants'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
  const profileOptions = [
    { id: 1, title: 'Personal Info', icon: images.person },
    { id: 2, title: 'Order History', icon: images.clock },
    { id: 3, title: 'Payment Methods', icon: images.dollar },
    { id: 4, title: 'Location', icon: images.location },
    { id: 5, title: 'Logout', icon: images.logout },
  ]

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='px-5 pt-5'>
        {/* Profile Header */}
        <View className='items-center mb-8'>
          <View className='profile-avatar mb-4'>
            <Image
              source={images.avatar}
              className='size-full rounded-full'
              resizeMode='cover'
            />
            <TouchableOpacity className='profile-edit'>
              <Image
                source={images.pencil}
                className='size-3'
                resizeMode='contain'
                tintColor='white'
              />
            </TouchableOpacity>
          </View>
          <Text className='h3-bold text-dark-100 mb-1'>John Doe</Text>
          <Text className='paragraph-medium text-gray-500'>
            john.doe@example.com
          </Text>
        </View>

        {/* Profile Options */}
        <View className='bg-white rounded-2xl'>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              className='profile-field'
              style={{
                borderBottomWidth: index < profileOptions.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
                paddingVertical: 16,
                paddingHorizontal: 20,
              }}
            >
              <View className='profile-field__icon'>
                <Image
                  source={option.icon}
                  className='size-5'
                  resizeMode='contain'
                  tintColor='#FF6B35'
                />
              </View>
              <View className='flex-1'>
                <Text className='paragraph-bold text-dark-100'>
                  {option.title}
                </Text>
              </View>
              <Image
                source={images.arrowRight}
                className='size-4'
                resizeMode='contain'
                tintColor='#9CA3AF'
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
