import { images } from '@/constants'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 20,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={Platform.OS === 'android' ? 100 : 80}
              tint='light'
              style={StyleSheet.absoluteFill}
            />
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor:
                  Platform.OS === 'android'
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(255, 255, 255, 0.3)',
                borderRadius: 25,
              }}
            />
          </View>
        ),
        tabBarLabelStyle: {
          fontFamily: 'Quicksand-Medium',
          fontSize: 12,
          marginTop: 5,
          fontWeight: Platform.OS === 'android' ? '600' : '500',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.home}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode='contain'
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.search}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode='contain'
            />
          ),
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.bag}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode='contain'
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={images.person}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
              resizeMode='contain'
            />
          ),
          href: '/profile',
        }}
      />
    </Tabs>
  )
}
