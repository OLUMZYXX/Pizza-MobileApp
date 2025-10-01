import cn from 'clsx'
import React from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native'

interface CustomButtonProps {
  title: string
  onPress: () => void
  textStyle?: string
  buttonStyle?: string
  leftIcon?: any
  rightIcon?: any
  isLoading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
}

const CustomButton = ({
  title = 'Click Me',
  onPress,
  textStyle,
  buttonStyle,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  variant = 'primary',
}: CustomButtonProps) => {
  const getButtonStyles = () => {
    const baseStyles =
      'flex-row items-center justify-center px-6 py-4 rounded-xl'

    switch (variant) {
      case 'secondary':
        return `${baseStyles} bg-gray-100`
      case 'outline':
        return `${baseStyles} border-2 border-primary bg-transparent`
      default:
        return `${baseStyles} bg-primary`
    }
  }

  const getTextStyles = () => {
    const baseStyles = 'font-quicksand-semibold text-base'

    switch (variant) {
      case 'secondary':
        return `${baseStyles} text-dark-100`
      case 'outline':
        return `${baseStyles} text-primary`
      default:
        return `${baseStyles} text-white`
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        getButtonStyles(),
        {
          'opacity-50': disabled || isLoading,
        },
        buttonStyle
      )}
      activeOpacity={0.8}
    >
      {/* Left Icon */}
      {leftIcon && !isLoading && (
        <Image
          source={leftIcon}
          className='size-5 mr-2'
          resizeMode='contain'
          tintColor={
            variant === 'primary'
              ? '#ffffff'
              : variant === 'outline'
                ? '#FF6B35'
                : '#1a1a1a'
          }
        />
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <ActivityIndicator
          size='small'
          color={variant === 'primary' ? '#ffffff' : '#FF6B35'}
          className='mr-2'
        />
      )}

      {/* Button Text */}
      <Text className={cn(getTextStyles(), textStyle)}>
        {isLoading ? 'Loading...' : title}
      </Text>

      {/* Right Icon */}
      {rightIcon && !isLoading && (
        <Image
          source={rightIcon}
          className='size-5 ml-2'
          resizeMode='contain'
          tintColor={
            variant === 'primary'
              ? '#ffffff'
              : variant === 'outline'
                ? '#FF6B35'
                : '#1a1a1a'
          }
        />
      )}
    </TouchableOpacity>
  )
}

export default CustomButton
