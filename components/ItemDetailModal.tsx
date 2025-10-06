import CustomAlert from '@/components/CustomAlert'
import { images } from '@/constants'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface ItemDetail {
  id: number
  title: string
  image: any
  color: string
  price: number
  originalPrice: number
  rating: number
  calories: number
  description: string
  images: any[]
  toppings: { name: string; price: number }[]
  sides: { name: string; price: number }[]
}

interface ItemDetailModalProps {
  visible: boolean
  item: ItemDetail | null
  onClose: () => void
  onAddToCart: (
    item: ItemDetail,
    selectedToppings: string[],
    selectedSides: string[]
  ) => void
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedSides, setSelectedSides] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Animate image transitions
  const animateImageTransition = useCallback(() => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Change image in the middle of animation
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % (item?.images.length || 1)
        return nextIndex
      })
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
  }, [fadeAnim, item?.images.length])

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    if (!item || item.images.length <= 1 || !visible) return

    const interval = setInterval(() => {
      animateImageTransition()
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [item, visible, item?.images.length, animateImageTransition])

  // Reset image index when modal opens with new item
  useEffect(() => {
    if (visible) {
      setCurrentImageIndex(0)
      fadeAnim.setValue(1) // Reset animation
    }
  }, [visible, item?.id, fadeAnim])

  // Handle manual image selection with animation
  const handleImageSelect = useCallback(
    (index: number) => {
      if (index === currentImageIndex) return

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex(index)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start()
      })
    },
    [currentImageIndex, fadeAnim]
  )

  if (!item) return null

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    )
  }

  const toggleSide = (sideName: string) => {
    setSelectedSides((prev) =>
      prev.includes(sideName)
        ? prev.filter((s) => s !== sideName)
        : [...prev, sideName]
    )
  }

  const calculateTotalPrice = () => {
    const basePrice = item.price
    const toppingsPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = item.toppings.find((t) => t.name === toppingName)
      return total + (topping?.price || 0)
    }, 0)
    const sidesPrice = selectedSides.reduce((total, sideName) => {
      const side = item.sides.find((s) => s.name === sideName)
      return total + (side?.price || 0)
    }, 0)
    return basePrice + toppingsPrice + sidesPrice
  }

  const handleAddToCart = () => {
    // Show alert first, don't call onAddToCart until alert is dismissed
    setShowSuccessAlert(true)
  }

  const handleAlertConfirm = () => {
    // Add to cart when user confirms the alert
    onAddToCart(item, selectedToppings, selectedSides)
    setShowSuccessAlert(false)
    setSelectedToppings([])
    setSelectedSides([])
    setCurrentImageIndex(0)
    onClose()
  }

  const discount = Math.round(
    ((item.originalPrice - item.price) / item.originalPrice) * 100
  )

  const handleClose = () => {
    if (!showSuccessAlert) {
      onClose()
    }
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={handleClose}
    >
      <View className='flex-1 bg-gray-50'>
        {/* Floating Close Button */}
        <TouchableOpacity
          onPress={handleClose}
          className='absolute top-12 left-5 z-50 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg'
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Image
            source={images.arrowBack}
            className='size-6'
            tintColor='#374151'
          />
        </TouchableOpacity>

        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 180 }}
        >
          {/* Hero Image Gallery */}
          <View className='relative bg-black mb-4'>
            <Animated.Image
              source={item.images[currentImageIndex]}
              className='w-full h-96'
              resizeMode='cover'
              style={{
                opacity: fadeAnim,
              }}
            />

            {/* Dark Overlay for better content visibility */}
            <View
              className='absolute inset-0'
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Discount Badge */}
            {discount > 0 && (
              <View className='absolute top-12 right-5 bg-red-500 px-4 py-2 rounded-full shadow-lg z-10'>
                <Text className='text-white font-quicksand-bold text-sm'>
                  {discount}% OFF
                </Text>
              </View>
            )}

            {/* Image Indicators */}
            {item.images.length > 1 && (
              <View className='absolute bottom-6 left-0 right-0 flex-row justify-center gap-2 z-10'>
                {item.images.map((_, index) => {
                  const isActive = index === currentImageIndex
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleImageSelect(index)}
                      activeOpacity={0.7}
                    >
                      <Animated.View
                        className={`h-2 rounded-full ${
                          isActive ? 'bg-white shadow-lg' : 'bg-white/60'
                        }`}
                        style={{
                          width: isActive ? 32 : 8,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      />
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}

            {/* Curved Bottom Edge */}
            <View className='absolute -bottom-6 left-0 right-0 h-8 bg-gray-50 rounded-t-[32px] z-10' />
          </View>

          {/* Content Container */}
          <View className='px-6'>
            {/* Title and Rating Card */}
            <View className='bg-white rounded-3xl p-6 mb-5 shadow-sm'>
              <View className='flex-row items-start justify-between mb-4'>
                <View className='flex-1 pr-4'>
                  <Text className='text-2xl font-quicksand-bold text-dark-100 leading-tight'>
                    {item.title}
                  </Text>
                </View>
                <View className='bg-amber-50 px-3 py-2 rounded-full flex-row items-center gap-1'>
                  <Image
                    source={images.star}
                    className='size-4'
                    tintColor='#F59E0B'
                  />
                  <Text className='text-base font-quicksand-bold text-amber-600'>
                    {item.rating}
                  </Text>
                </View>
              </View>

              {/* Price Section */}
              <View className='flex-row items-center gap-3 mb-4'>
                <Text className='text-3xl font-quicksand-bold text-primary'>
                  ${item.price.toFixed(2)}
                </Text>
                {item.originalPrice > item.price && (
                  <Text className='text-xl text-gray-400 line-through font-quicksand-medium'>
                    ${item.originalPrice.toFixed(2)}
                  </Text>
                )}
              </View>

              {/* Calories Badge */}
              <View className='flex-row items-center gap-2 bg-gray-50 px-4 py-2 rounded-full self-start'>
                <Image
                  source={images.clock}
                  className='size-4'
                  tintColor='#6B7280'
                />
                <Text className='text-sm font-quicksand-medium text-gray-600'>
                  {item.calories} cal
                </Text>
              </View>
            </View>

            {/* Description Card */}
            <View className='bg-white rounded-3xl p-6 mb-5 shadow-sm'>
              <Text className='text-sm font-quicksand-bold text-dark-100 mb-3 uppercase tracking-wide'>
                About This Dish
              </Text>
              <Text className='text-base text-gray-700 leading-relaxed font-quicksand-regular'>
                {item.description}
              </Text>
            </View>

            {/* Toppings Section */}
            {item.toppings.length > 0 && (
              <View className='mb-5'>
                <View className='flex-row items-center justify-between mb-4 px-1'>
                  <Text className='text-xl font-quicksand-bold text-dark-100'>
                    ✨ Add Toppings
                  </Text>
                  {selectedToppings.length > 0 && (
                    <View className='bg-primary/10 px-3 py-1.5 rounded-full'>
                      <Text className='text-primary font-quicksand-bold text-xs'>
                        {selectedToppings.length} selected
                      </Text>
                    </View>
                  )}
                </View>
                <View className='gap-3'>
                  {item.toppings.map((topping, index) => {
                    const isSelected = selectedToppings.includes(topping.name)
                    return (
                      <TouchableOpacity
                        key={topping.name}
                        onPress={() => toggleTopping(topping.name)}
                        className={`flex-row items-center justify-between p-4 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-primary border-2 border-primary shadow-md'
                            : 'bg-white shadow-sm'
                        }`}
                        activeOpacity={0.7}
                        style={{
                          shadowColor: isSelected
                            ? item.color || '#FF6B6B'
                            : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isSelected ? 0.2 : 0.05,
                          shadowRadius: isSelected ? 6 : 3,
                          elevation: isSelected ? 4 : 2,
                        }}
                      >
                        <View className='flex-row items-center gap-3 flex-1'>
                          <View
                            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                              isSelected
                                ? 'bg-white border-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <View className='w-3 h-3 rounded-full bg-primary' />
                            )}
                          </View>
                          <Text
                            className={`font-quicksand-semibold text-base flex-1 ${
                              isSelected ? 'text-white' : 'text-gray-800'
                            }`}
                          >
                            {topping.name}
                          </Text>
                        </View>
                        <Text
                          className={`font-quicksand-bold text-base ml-2 ${
                            isSelected ? 'text-white' : 'text-primary'
                          }`}
                        >
                          +${topping.price.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )}

            {/* Sides Section */}
            {item.sides.length > 0 && (
              <View className='mb-6'>
                <View className='flex-row items-center justify-between mb-4 px-1'>
                  <Text className='text-xl font-quicksand-bold text-dark-100'>
                    🍟 Choose Sides
                  </Text>
                  {selectedSides.length > 0 && (
                    <View className='bg-primary/10 px-3 py-1.5 rounded-full'>
                      <Text className='text-primary font-quicksand-bold text-xs'>
                        {selectedSides.length} selected
                      </Text>
                    </View>
                  )}
                </View>
                <View className='gap-3'>
                  {item.sides.map((side, index) => {
                    const isSelected = selectedSides.includes(side.name)
                    return (
                      <TouchableOpacity
                        key={side.name}
                        onPress={() => toggleSide(side.name)}
                        className={`flex-row items-center justify-between p-4 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-primary border-2 border-primary shadow-md'
                            : 'bg-white shadow-sm'
                        }`}
                        activeOpacity={0.7}
                        style={{
                          shadowColor: isSelected
                            ? item.color || '#FF6B6B'
                            : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isSelected ? 0.2 : 0.05,
                          shadowRadius: isSelected ? 6 : 3,
                          elevation: isSelected ? 4 : 2,
                        }}
                      >
                        <View className='flex-row items-center gap-3 flex-1'>
                          <View
                            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                              isSelected
                                ? 'bg-white border-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <View className='w-3 h-3 rounded-full bg-primary' />
                            )}
                          </View>
                          <Text
                            className={`font-quicksand-semibold text-base flex-1 ${
                              isSelected ? 'text-white' : 'text-gray-800'
                            }`}
                          >
                            {side.name}
                          </Text>
                        </View>
                        <Text
                          className={`font-quicksand-bold text-base ml-2 ${
                            isSelected ? 'text-white' : 'text-primary'
                          }`}
                        >
                          +${side.price.toFixed(2)}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Bottom Bar */}
        <View
          className='absolute bottom-0 left-0 right-0 bg-white px-6 pt-5 pb-8'
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <View className='flex-row items-center justify-between mb-4'>
            <View>
              <Text className='text-sm text-gray-500 font-quicksand-medium mb-1'>
                Total Amount
              </Text>
              <Text className='text-3xl font-quicksand-bold text-dark-100'>
                ${calculateTotalPrice().toFixed(2)}
              </Text>
            </View>
            {selectedToppings.length + selectedSides.length > 0 && (
              <View className='bg-primary/10 px-4 py-2 rounded-full'>
                <Text className='text-primary font-quicksand-bold text-sm'>
                  {selectedToppings.length + selectedSides.length} extras
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            className='bg-primary py-5 rounded-2xl items-center shadow-lg'
            activeOpacity={0.8}
            style={{
              shadowColor: item.color || '#FF6B6B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className='text-white font-quicksand-bold text-lg'>
              Add to Cart 🛒
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomAlert
        visible={showSuccessAlert}
        title='Added to Cart!'
        message={`${item.title} has been added to your cart successfully.`}
        type='success'
        confirmText='Continue Shopping'
        onConfirm={handleAlertConfirm}
        showCancel={false}
      />
    </Modal>
  )
}
