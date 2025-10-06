import { CustomInputProps } from '@/type'
import cn from 'clsx'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
const CustomInput = ({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = 'default',
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <View>
      <Text className='label'>{label}</Text>
      <View className='relative'>
        <TextInput
          autoCapitalize='none'
          autoComplete='off'
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor='#888'
          className={cn('input', {
            'border-primary': isFocused,
            'border-gray-300': !isFocused,
          })}
          style={secureTextEntry ? { paddingRight: 50 } : undefined}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 24 }}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CustomInput
