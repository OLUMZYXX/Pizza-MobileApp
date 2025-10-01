import { CustomInputProps } from '@/type'
import cn from 'clsx'
import React from 'react'
import { Text, TextInput, View } from 'react-native'
const CustomInput = ({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = 'default',
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = React.useState(false)
  return (
    <View>
      <Text className='label'>{label}</Text>
      <TextInput
        autoCapitalize='none'
        autoComplete='off'
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor='#888'
        className={cn('input', {
          'border-primary': isFocused,
          'border-gray-300': !isFocused,
        })}
      />
    </View>
  )
}

export default CustomInput
