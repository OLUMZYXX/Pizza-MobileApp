import { images } from '@/constants'
import React from 'react'
import { Image, TextInput, View } from 'react-native'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (text: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search for food, drinks...',
}) => {
  return (
    <View className='searchbar p-4'>
      <Image
        source={images.search}
        className='size-5'
        resizeMode='contain'
        tintColor='#999'
      />
      <TextInput
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={onSearchChange}
        className='flex-1 text-base font-quicksand-medium text-dark-100'
        placeholderTextColor='#999'
      />
    </View>
  )
}

export default SearchBar
