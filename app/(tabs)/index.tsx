import { CATEGORIES, images, offers } from '@/constants'
import cn from 'clsx'
import React, { Fragment, useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CartButton from '../../components/CartButton'
import '../../global.css'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Function to get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours()

    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning!', emoji: '🌅' }
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon!', emoji: '☀️' }
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Good Evening!', emoji: '🌆' }
    } else {
      return { text: 'Good Night!', emoji: '🌙' }
    }
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const greeting = getGreeting()

  const Header = () => (
    <View className='px-5 pt-2'>
      {/* Top Header */}
      <View className='flex-between flex-row w-full mb-6'>
        <View className='flex-start'>
          <Text className='small-bold text-gray-400 mb-1'>DELIVER TO</Text>
          <TouchableOpacity className='flex-row items-center gap-x-2'>
            <Image
              source={images.location}
              className='size-4'
              resizeMode='contain'
              tintColor='#FF6B35'
            />
            <Text className='text-dark-100 paragraph-bold'>Nigeria</Text>
            <Image
              source={images.arrowDown}
              className='size-3'
              resizeMode='contain'
              tintColor='#666'
            />
          </TouchableOpacity>
        </View>
        <CartButton />
      </View>

      {/* Greeting */}
      <View className='mb-6'>
        <Text className='h1-bold text-dark-100 mb-1'>
          {greeting.text} {greeting.emoji}
        </Text>
        <Text className='paragraph-medium text-gray-500'>
          What would you like to eat today?
        </Text>
      </View>

      {/* Search Bar */}
      <View className='searchbar p-4 mb-6'>
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
        className='mb-8'
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.name)}
            className={cn(
              'filter mr-3 mb-2',
              selectedCategory === category.name ? 'bg-primary' : 'bg-gray-50'
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

      {/* Special Offers Title */}
      <View className='flex-between flex-row mb-4'>
        <Text className='base-bold text-dark-100'>Special Offers 🔥</Text>
        <TouchableOpacity>
          <Text className='paragraph-medium text-primary'>See all</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <FlatList
        data={offers}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='none'
        renderItem={({ item, index }) => {
          // Cards 2 and 4 (index 1 and 3) will have image on left
          const imageOnLeft = index === 1 || index === 3

          return (
            <Pressable
              className={cn(
                'mx-4 mb-6 rounded-3xl overflow-hidden relative',
                'h-56 flex items-stretch'
              )}
              style={{
                backgroundColor: item.color,
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 10,
              }}
              android_ripple={{ color: '#ffffff15' }}
            >
              {({ pressed }) => (
                <Fragment>
                  {/* Background Pattern */}
                  <View className='absolute inset-0'>
                    <View className='absolute top-6 right-6 size-16 rounded-full bg-white/8' />
                    <View className='absolute top-16 right-16 size-8 rounded-full bg-white/12' />
                    <View className='absolute bottom-12 left-8 size-12 rounded-full bg-white/6' />
                    <View className='absolute bottom-20 left-20 size-4 rounded-full bg-white/15' />
                  </View>

                  <View
                    className={cn(
                      'flex-1 flex',
                      imageOnLeft ? 'flex-row' : 'flex-row'
                    )}
                  >
                    {imageOnLeft ? (
                      <Fragment>
                        {/* Image Section - On Left for cards 2 & 4 */}
                        <View className='w-1/2 relative flex items-center justify-center p-2'>
                          <Image
                            source={item.image}
                            className='size-full'
                            resizeMode='contain'
                            style={{
                              transform: [{ scale: 1.3 }],
                            }}
                          />
                        </View>

                        {/* Content Section - On Right for cards 2 & 4 */}
                        <View className='flex-1 flex flex-col justify-between p-5'>
                          <View className='flex flex-col items-end'>
                            <View className='bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3'>
                              <Text className='text-xs font-bold text-white tracking-wider'>
                                🔥 LIMITED OFFER
                              </Text>
                            </View>
                            <Text
                              className='text-2xl font-bold text-white leading-none mb-2 text-right'
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {item.title}
                            </Text>
                          </View>

                          <View className='flex flex-col items-end'>
                            <Text className='text-sm text-white/85 mb-4 leading-relaxed text-right'>
                              Enjoy up to 30% discount{'\n'}on your favorite
                              meals
                            </Text>
                            <TouchableOpacity
                              className='bg-white/20 backdrop-blur-sm flex-row items-center px-4 py-3 rounded-full border border-white/30'
                              activeOpacity={0.8}
                            >
                              <Text className='text-white font-semibold text-sm mr-2'>
                                Order Now
                              </Text>
                              <View className='bg-white/30 p-1.5 rounded-full'>
                                <Image
                                  source={images.arrowRight}
                                  className='size-3'
                                  resizeMode='contain'
                                  tintColor='#ffffff'
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Fragment>
                    ) : (
                      <Fragment>
                        {/* Content Section - On Left for cards 1 & 3 */}
                        <View className='flex-1 flex flex-col justify-between p-5'>
                          <View className='flex flex-col items-start'>
                            <View className='bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3'>
                              <Text className='text-xs font-bold text-white tracking-wider'>
                                🔥 LIMITED OFFER
                              </Text>
                            </View>
                            <Text
                              className='text-2xl font-bold text-white leading-none mb-2 text-left'
                              numberOfLines={1}
                              ellipsizeMode='tail'
                            >
                              {item.title}
                            </Text>
                          </View>

                          <View className='flex flex-col items-start'>
                            <Text className='text-sm text-white/85 mb-4 leading-relaxed text-left'>
                              Enjoy up to 30% discount{'\n'}on your favorite
                              meals
                            </Text>
                            <TouchableOpacity
                              className='bg-white/20 backdrop-blur-sm flex-row items-center px-4 py-3 rounded-full border border-white/30'
                              activeOpacity={0.8}
                            >
                              <Text className='text-white font-semibold text-sm mr-2'>
                                Order Now
                              </Text>
                              <View className='bg-white/30 p-1.5 rounded-full'>
                                <Image
                                  source={images.arrowRight}
                                  className='size-3'
                                  resizeMode='contain'
                                  tintColor='#ffffff'
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Image Section - On Right for cards 1 & 3 */}
                        <View className='w-1/2 relative flex items-center justify-center p-2'>
                          <Image
                            source={item.image}
                            className='size-full'
                            resizeMode='contain'
                            style={{
                              transform: [{ scale: 1.3 }],
                            }}
                          />
                        </View>
                      </Fragment>
                    )}
                  </View>
                </Fragment>
              )}
            </Pressable>
          )
        }}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={Header}
        contentContainerClassName='pb-28'
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}
