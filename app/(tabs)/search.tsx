import { CATEGORIES, images } from '@/constants'
import cn from 'clsx'
import React, { useState } from 'react'
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredOffers = [
    {
      id: 1,
      title: 'SUMMER COMBO',
      image: images.burgerOne,
      color: '#D33B0D',
      category: 'Burger',
    },
    {
      id: 2,
      title: 'BURGER BASH',
      image: images.burgerTwo,
      color: '#DF5A0C',
      category: 'Burger',
    },
    {
      id: 3,
      title: 'PIZZA PARTY',
      image: images.pizzaOne,
      color: '#084137',
      category: 'Pizza',
    },
    {
      id: 4,
      title: 'BURRITO DELIGHT',
      image: images.buritto,
      color: '#EB920C',
      category: 'Burrito',
    },
  ].filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  )

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 px-5 pt-4'>
        {/* Search Header */}
        <View className='mb-6'>
          <Text className='text-2xl font-quicksand-bold text-dark-100 mb-4'>
            Search
          </Text>

          {/* Search Bar */}
          <View className='searchbar p-4 mb-4'>
            <Image
              source={images.search}
              className='size-5'
              resizeMode='contain'
              tintColor='#999'
            />
            <TextInput
              placeholder='Search for food, drinks...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              className='flex-1 text-base font-quicksand-medium text-dark-100'
              placeholderTextColor='#999'
            />
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='mb-4'
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.name)}
                className={cn(
                  'filter mr-3 mb-2',
                  selectedCategory === category.name
                    ? 'bg-primary'
                    : 'bg-gray-50'
                )}
              >
                <Text
                  className={cn(
                    'paragraph-semibold',
                    selectedCategory === category.name
                      ? 'text-white'
                      : 'text-gray-600'
                  )}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Results */}
        <FlatList
          data={filteredOffers}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className='bg-white rounded-2xl p-4 mb-4 shadow-sm'
              activeOpacity={0.8}
            >
              <View className='flex-row items-center'>
                <Image
                  source={item.image}
                  className='size-16 rounded-xl mr-4'
                  resizeMode='cover'
                />
                <View className='flex-1'>
                  <Text className='text-lg font-quicksand-bold text-dark-100 mb-1'>
                    {item.title}
                  </Text>
                  <Text className='text-sm text-gray-500 font-quicksand-medium'>
                    {item.category}
                  </Text>
                </View>
                <View
                  className='size-4 rounded-full'
                  style={{ backgroundColor: item.color }}
                />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className='flex-1 items-center justify-center py-20'>
              <Image
                source={images.emptyState}
                className='size-32 opacity-50 mb-4'
                resizeMode='contain'
              />
              <Text className='text-lg font-quicksand-medium text-gray-400 text-center'>
                No items found
              </Text>
              <Text className='text-sm text-gray-500 text-center mt-2'>
                Try adjusting your search or category
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  )
}

export default Search
