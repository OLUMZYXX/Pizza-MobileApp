import CustomAlert from '@/components/CustomAlert'
import { images } from '@/constants'
import { useAuth } from '@/contexts/AuthContext'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
  const { user, signOut, deleteAccount } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null
  )
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    onConfirm: () => {},
    onCancel: () => {},
  })

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage)
    }
  }, [user?.profileImage])

  const profileOptions = [
    {
      id: 1,
      title: 'Personal Info',
      icon: images.person,
      action: () => router.push('/profile/personal-info'),
    },
    { id: 2, title: 'Order History', icon: images.clock, action: () => {} },
    {
      id: 3,
      title: 'Payment Methods',
      icon: images.dollar,
      action: () => router.push('/profile/payment-methods'),
    },
    {
      id: 4,
      title: 'Location',
      icon: images.location,
      action: () => router.push('/profile/location'),
    },
    {
      id: 5,
      title: 'Delete Account',
      icon: images.trash,
      action: () => handleDeleteAccount(),
    },
    {
      id: 6,
      title: 'Logout',
      icon: images.logout,
      action: () => handleLogout(),
    },
  ]

  const handleAvatarChange = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission required',
          'Permission to access camera roll is required!'
        )
        return
      }

      // Show options
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
              // In a real app, you would upload this to your server
              Alert.alert('Success', 'Profile picture updated!')
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
              // In a real app, you would upload this to your server
              Alert.alert('Success', 'Profile picture updated!')
            }
          },
        },
      ])
    } catch {
      Alert.alert('Error', 'Failed to change profile picture')
    }
  }

  const handleLogout = () => {
    setAlertConfig({
      visible: true,
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      type: 'warning',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        setAlertConfig({ ...alertConfig, visible: false })
        signOut()
        router.replace('/(auth)/sign-in')
      },
      onCancel: () => {
        setAlertConfig({ ...alertConfig, visible: false })
      },
    })
  }

  const handleDeleteAccount = () => {
    setAlertConfig({
      visible: true,
      title: 'Delete Account',
      message:
        'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      type: 'error',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: async () => {
        setAlertConfig({ ...alertConfig, visible: false })
        try {
          await deleteAccount()
          setAlertConfig({
            visible: true,
            title: 'Account Deleted',
            message: 'Your account has been successfully deleted.',
            type: 'success',
            confirmText: 'OK',
            cancelText: 'Cancel',
            showCancel: false,
            onConfirm: () => {
              setAlertConfig({ ...alertConfig, visible: false })
              router.replace('/(auth)/sign-in')
            },
            onCancel: () => {},
          })
        } catch {
          setAlertConfig({
            visible: true,
            title: 'Error',
            message: 'Failed to delete account. Please try again.',
            type: 'error',
            confirmText: 'OK',
            cancelText: 'Cancel',
            showCancel: false,
            onConfirm: () => {
              setAlertConfig({ ...alertConfig, visible: false })
            },
            onCancel: () => {},
          })
        }
      },
      onCancel: () => {
        setAlertConfig({ ...alertConfig, visible: false })
      },
    })
  }

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className='px-5 pt-5'>
          {/* Profile Header */}
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
              <TouchableOpacity className='profile-edit'>
                <Image
                  source={images.pencil}
                  className='size-3'
                  resizeMode='contain'
                  tintColor='white'
                />
              </TouchableOpacity>
            </TouchableOpacity>
            <Text className='h3-bold text-dark-100 mb-1'>
              {user?.username || 'User'}
            </Text>
            <Text className='paragraph-medium text-gray-500'>
              {user?.email || 'user@example.com'}
            </Text>
          </View>

          {/* Profile Options */}
          <View className='bg-white rounded-2xl mb-6'>
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
                onPress={option.action}
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
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </SafeAreaView>
  )
}
