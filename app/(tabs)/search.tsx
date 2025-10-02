import { CATEGORIES, images, offers } from '@/constants'
import { useCart } from '@/contexts/CartContext'
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
import { ItemDetailModal } from '../../components/ItemDetailModal'

const Search = () => {
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Filter offers based on search query and category
  const filteredOffers = offers.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Burger' &&
        (item.title.toLowerCase().includes('burger') ||
          item.title.toLowerCase().includes('combo'))) ||
      (selectedCategory === 'Pizza' &&
        item.title.toLowerCase().includes('pizza')) ||
      (selectedCategory === 'Wrap' &&
        item.title.toLowerCase().includes('burrito'))
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleItemPress = (item: any) => {
    setSelectedItem(item)
    setModalVisible(true)
  }

  const handleAddToCart = (
    item: any,
    selectedToppings: string[],
    selectedSides: string[]
  ) => {
    addToCart(item, selectedToppings, selectedSides)
    setModalVisible(false)
    setSelectedItem(null)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedItem(null)
  }

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
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              className='bg-white rounded-2xl p-4 m-2 flex-1 shadow-sm'
              activeOpacity={0.8}
            >
              <View className='items-center'>
                <Image
                  source={item.image}
                  className='size-24 rounded-xl mb-3'
                  resizeMode='cover'
                />
                <View className='items-center'>
                  <Text className='text-lg font-quicksand-bold text-dark-100 mb-1 text-center'>
                    {item.title}
                  </Text>
                  <View className='flex-row items-center space-x-1 mb-2'>
                    <Image
                      source={images.star}
                      className='size-4'
                      tintColor='#FFD700'
                    />
                    <Text className='text-sm font-quicksand-medium text-gray-600'>
                      {item.rating}
                    </Text>
                  </View>
                  <Text className='text-lg font-quicksand-bold text-primary'>
                    ${item.price.toFixed(2)}
                  </Text>
                  <Text className='text-sm text-gray-500 line-through'>
                    ${item.originalPrice.toFixed(2)}
                  </Text>
                </View>
                <View
                  className='size-3 rounded-full mt-2'
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
                {searchQuery ? `"${searchQuery}" not found` : 'No items found'}
              </Text>
              <Text className='text-sm text-gray-500 text-center mt-2'>
                {searchQuery
                  ? 'Try searching for burgers, pizza, burritos, or other menu items'
                  : 'Try adjusting your category filter'}
              </Text>
            </View>
          }
        />

        <ItemDetailModal
          visible={modalVisible}
          item={selectedItem}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      </View>
    </SafeAreaView>
  )
}

export default Search
