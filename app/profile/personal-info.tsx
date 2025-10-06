import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { images } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'
import * as ImagePicker from 'expo-image-picker'
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

export default function PersonalInfo() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || '',
  })
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null
  )
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleAvatarChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission required',
          'Permission to access camera roll is required!'
        )
        return
      }

      Alert.alert('Change Profile Picture', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri)
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri)
            }
          },
        },
      ])
    } catch {
      Alert.alert('Error', 'Failed to change profile picture')
    }
  }

  const handleSave = async () => {
    if (!form.username.trim()) {
      Alert.alert('Error', 'Username cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      await updateUser({
        username: form.username,
        fullName: form.fullName,
        profileImage: profileImage || undefined,
      })
      Alert.alert('Success', 'Profile updated successfully!')
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all password fields')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would verify old password and update via API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert('Success', 'Password changed successfully!')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      Alert.alert('Error', 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1'>
        <View className='px-5 pt-5'>
          {/* Header */}
          <View className='flex-row items-center mb-6'>
            <TouchableOpacity
              onPress={() => router.back()}
              className='mr-4 p-2'
            >
              <Image
                source={images.arrowBack}
                className='size-5'
                resizeMode='contain'
                tintColor='#1a1a1a'
              />
            </TouchableOpacity>
            <Text className='text-2xl font-quicksand-bold text-dark-100'>
              Personal Information
            </Text>
          </View>

          {/* Profile Avatar */}
          <View className='items-center mb-8'>
            <TouchableOpacity
              onPress={handleAvatarChange}
              className='profile-avatar mb-4'
            >
              <Image
                source={profileImage ? { uri: profileImage } : images.avatar}
                className='size-full rounded-full'
                resizeMode='cover'
              />
              <View className='profile-edit'>
                <Image
                  source={images.pencil}
                  className='size-3'
                  resizeMode='contain'
                  tintColor='white'
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity className='mt-2' onPress={handleAvatarChange}>
              <Text className='text-primary font-quicksand-medium text-sm'>
                Change Profile Picture
              </Text>
            </TouchableOpacity>
          </View>

          {/* Personal Info Form */}
          <View className='w-full mb-6'>
            <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
              Profile Details
            </Text>

            <View className='mb-4'>
              <CustomInput
                label='Username'
                placeholder='Enter your username'
                value={form.username}
                onChangeText={(text) => setForm({ ...form, username: text })}
              />
            </View>

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
                label='Email Address'
                placeholder='your.email@example.com'
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                keyboardType='email-address'
              />
              <Text className='text-xs text-gray-500 mt-1'>
                Email cannot be changed
              </Text>
            </View>
          </View>

          {/* Change Password Section */}
          <View className='w-full mb-6'>
            <Text className='text-lg font-quicksand-bold text-dark-100 mb-4'>
              Change Password
            </Text>

            <View className='mb-4'>
              <CustomInput
                label='Old Password'
                placeholder='Enter your old password'
                value={passwordForm.oldPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, oldPassword: text })
                }
                secureTextEntry
              />
            </View>

            <View className='mb-4'>
              <CustomInput
                label='New Password'
                placeholder='Enter your new password'
                value={passwordForm.newPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, newPassword: text })
                }
                secureTextEntry
              />
            </View>

            <View className='mb-4'>
              <CustomInput
                label='Confirm New Password'
                placeholder='Confirm your new password'
                value={passwordForm.confirmPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: text })
                }
                secureTextEntry
              />
            </View>
          </View>

          {/* Save Changes Button */}
          <View className='w-full mb-8'>
            <CustomButton
              title='Save Changes'
              onPress={handleSave}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
