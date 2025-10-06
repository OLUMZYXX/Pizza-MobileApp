import React from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

interface CustomAlertProps {
  visible: boolean
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
}: CustomAlertProps) {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: '✓', color: '#10B981', bgColor: '#D1FAE5' }
      case 'error':
        return { icon: '✕', color: '#EF4444', bgColor: '#FEE2E2' }
      case 'warning':
        return { icon: '!', color: '#F59E0B', bgColor: '#FEF3C7' }
      default:
        return { icon: 'i', color: '#3B82F6', bgColor: '#DBEAFE' }
    }
  }

  const { icon, color, bgColor } = getIconAndColor()

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onCancel}
    >
      <Pressable
        className='flex-1 bg-black/50 justify-center items-center px-6'
        onPress={showCancel ? onCancel : undefined}
      >
        <Pressable
          className='bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl'
          onPress={(e) => e.stopPropagation()}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Icon Section */}
          <View className='items-center pt-10 pb-6 px-6'>
            <View
              className='size-20 rounded-full items-center justify-center mb-5'
              style={{
                backgroundColor: bgColor,
                shadowColor: color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className='text-4xl font-quicksand-bold' style={{ color }}>
                {icon}
              </Text>
            </View>

            {/* Title */}
            <Text className='text-2xl font-quicksand-bold text-dark-100 mb-3 text-center'>
              {title}
            </Text>

            {/* Message */}
            <Text className='text-base font-quicksand-regular text-gray-600 text-center leading-relaxed'>
              {message}
            </Text>
          </View>

          {/* Buttons Section */}
          <View className='p-6 pt-4 gap-3'>
            <TouchableOpacity
              className='bg-primary py-4 rounded-2xl items-center justify-center shadow-md'
              onPress={onConfirm || onCancel}
              activeOpacity={0.8}
              style={{
                backgroundColor:
                  type === 'error'
                    ? color
                    : type === 'warning'
                      ? color
                      : '#FF6B35',
                shadowColor:
                  type === 'error'
                    ? color
                    : type === 'warning'
                      ? color
                      : '#FF6B35',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className='text-base font-quicksand-bold text-white'>
                {confirmText}
              </Text>
            </TouchableOpacity>

            {showCancel && (
              <TouchableOpacity
                className='bg-gray-100 py-4 rounded-2xl items-center justify-center'
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text className='text-base font-quicksand-semibold text-gray-700'>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
