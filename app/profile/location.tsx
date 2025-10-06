import CustomButton from '@/components/CustomButton'
import { images } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Location() {
  const { user, updateLocation } = useAuth()
  const [selectedLocation, setSelectedLocation] = useState(
    user?.location || 'Nigeria'
  )
  const [isLoading, setIsLoading] = useState(false)

  const locations = [
    'Nigeria',
    'Ghana',
    'Kenya',
    'South Africa',
    'USA',
    'UK',
    'Canada',
    'Australia',
    'India',
    'Brazil',
  ]

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateLocation(selectedLocation)
      Alert.alert('Success', 'Location updated successfully!')
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to update location')
    } finally {
      setIsLoading(false)
    }
  }

  const renderLocation = ({ item }: { item: string }) => (
    <TouchableOpacity
      className={`p-4 mb-2 rounded-xl ${
        selectedLocation === item ? 'bg-primary/5' : 'bg-gray-50'
      }`}
      onPress={() => setSelectedLocation(item)}
    >
      <View className='flex-row items-center justify-between'>
        <Text
          className={`text-lg font-quicksand-medium ${
            selectedLocation === item ? 'text-primary' : 'text-dark-100'
          }`}
        >
          {item}
        </Text>
        {selectedLocation === item && (
          <Image
            source={images.check}
            className='size-5'
            resizeMode='contain'
            tintColor='#FF6B35'
          />
        )}
      </View>
    </TouchableOpacity>
  )

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
            Select Location
          </Text>
        </View>

        {/* Current Location Display */}
        <View className='mb-6 p-4 bg-gray-50 rounded-xl'>
          <Text className='text-sm font-quicksand-medium text-gray-500 mb-1'>
            Current Location
          </Text>
          <Text className='text-lg font-quicksand-bold text-dark-100'>
            {selectedLocation}
          </Text>
        </View>

        {/* Location List */}
        <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
          Choose Your Location
        </Text>

        <FlatList
          data={locations}
          renderItem={renderLocation}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Save Button */}
        <View className='absolute bottom-0 left-0 right-0 p-5 bg-white'>
          <CustomButton
            title='Save Location'
            onPress={handleSave}
            isLoading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
