import { images } from '@/constants'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Quicksand-Medium',
          fontSize: 12,
          marginTop: 5,
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
