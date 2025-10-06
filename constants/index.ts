import arrowDown from '@/assets/icons/arrow-down.png'
import arrowRight from '@/assets/icons/arrow-right.png'
import bag from '@/assets/icons/bag.png'
import check from '@/assets/icons/check.png'
import clock from '@/assets/icons/clock.png'
import dollar from '@/assets/icons/dollar.png'
import envelope from '@/assets/icons/envelope.png'
import home from '@/assets/icons/home.png'
import location from '@/assets/icons/location.png'
import logout from '@/assets/icons/logout.png'
import minus from '@/assets/icons/minus.png'
import pencil from '@/assets/icons/pencil.png'
import person from '@/assets/icons/person.png'
import phone from '@/assets/icons/phone.png'
import plus from '@/assets/icons/plus.png'
import search from '@/assets/icons/search.png'
import star from '@/assets/icons/star.png'
import trash from '@/assets/icons/trash.png'
import user from '@/assets/icons/user.png'
import avatar from '@/assets/images/avatar.png'
import avocado from '@/assets/images/avocado.png'
import bacon from '@/assets/images/bacon.png'
import burgerImage from '@/assets/images/burger-image .jpg'
import burgerOne from '@/assets/images/burger-one.png'
import burgerTwo from '@/assets/images/burger-two.png'
import buritto from '@/assets/images/buritto.png'
import cheese from '@/assets/images/cheese.png'
import chickenWings from '@/assets/images/chicken-wings.png'
import coleslaw from '@/assets/images/coleslaw.png'
import cucumber from '@/assets/images/cucumber.png'
import emptyState from '@/assets/images/empty-state.png'
import fries from '@/assets/images/fries.png'
import loginGraphic from '@/assets/images/login-graphic.png'
import logo from '@/assets/images/logo.png'
import mozarellaSticks from '@/assets/images/mozarella-sticks.png'
import mushrooms from '@/assets/images/mushrooms.png'
import onionRings from '@/assets/images/onion-rings.png'
import onions from '@/assets/images/onions.png'
import pasta from '@/assets/images/pasta.jpg'
import pizzaOne from '@/assets/images/pizza-one.png'
import salad from '@/assets/images/salad.png'
import signup from '@/assets/images/signup.png'
import success from '@/assets/images/success.png'
import tomatoes from '@/assets/images/tomatoes.png'
import arrowBack from '../assets/icons/arrow-back.png'

export const CATEGORIES = [
  {
    id: '1',
    name: 'All',
  },
  {
    id: '2',
    name: 'Burger',
  },
  {
    id: '3',
    name: 'Pizza',
  },
  {
    id: '4',
    name: 'Wrap',
  },
  {
    id: '5',
    name: 'Burrito',
  },
]

export const offers = [
  {
    id: 1,
    title: 'SUMMER COMBO',
    image: burgerOne,
    color: '#D33B0D',
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.8,
    calories: 850,
    description:
      'Juicy beef patty with fresh lettuce, tomatoes, onions, and our signature sauce. Perfect for summer days!',
    images: [burgerOne],
    toppings: [
      { name: 'Extra Cheese', price: 1.5 },
      { name: 'Bacon', price: 2.0 },
      { name: 'Avocado', price: 1.5 },
      { name: 'Mushrooms', price: 1.2 },
    ],
    sides: [
      { name: 'Fries', price: 3.5 },
      { name: 'Onion Rings', price: 4.0 },
      { name: 'Coleslaw', price: 2.5 },
    ],
  },
  {
    id: 2,
    title: 'BURGER BASH',
    image: burgerImage,
    color: '#DF5A0C',
    price: 14.99,
    originalPrice: 18.99,
    rating: 4.9,
    calories: 920,
    description:
      "Double beef patty with crispy bacon, melted cheese, and our special BBQ sauce. A burger lover's dream!",
    images: [burgerImage],
    toppings: [
      { name: 'Extra Patty', price: 3.0 },
      { name: 'Bacon', price: 2.0 },
      { name: 'Cheese', price: 1.0 },
      { name: 'Onions', price: 0.5 },
    ],
    sides: [
      { name: 'Fries', price: 3.5 },
      { name: 'Onion Rings', price: 4.0 },
      { name: 'Mozarella Sticks', price: 5.0 },
    ],
  },
  {
    id: 3,
    title: 'PIZZA PARTY',
    image: pizzaOne,
    color: '#084137',
    price: 16.99,
    originalPrice: 21.99,
    rating: 4.7,
    calories: 1200,
    description:
      'Large pepperoni pizza with extra cheese, mushrooms, and bell peppers. Perfect for sharing with friends!',
    images: [pizzaOne],
    toppings: [
      { name: 'Extra Cheese', price: 2.0 },
      { name: 'Pepperoni', price: 2.5 },
      { name: 'Mushrooms', price: 1.2 },
      { name: 'Bell Peppers', price: 1.0 },
    ],
    sides: [
      { name: 'Garlic Bread', price: 4.0 },
      { name: 'Salad', price: 4.5 },
      { name: 'Onion Rings', price: 4.0 },
    ],
  },
  {
    id: 4,
    title: 'BURRITO DELIGHT',
    image: buritto,
    color: '#EB920C',
    price: 11.99,
    originalPrice: 14.99,
    rating: 4.6,
    calories: 780,
    description:
      'Grilled chicken burrito with rice, beans, cheese, and salsa. Wrapped in a warm flour tortilla!',
    images: [buritto],
    toppings: [
      { name: 'Extra Chicken', price: 2.5 },
      { name: 'Cheese', price: 1.0 },
      { name: 'Sour Cream', price: 0.8 },
      { name: 'Guacamole', price: 1.5 },
    ],
    sides: [
      { name: 'Chips & Salsa', price: 3.0 },
      { name: 'Fries', price: 3.5 },
      { name: 'Coleslaw', price: 2.5 },
    ],
  },
  {
    id: 5,
    title: 'CHICKEN WINGS',
    image: chickenWings,
    color: '#FF6B35',
    price: 13.99,
    originalPrice: 16.99,
    rating: 4.5,
    calories: 650,
    description:
      'Crispy chicken wings with your choice of sauce. Served with celery and ranch dressing!',
    images: [chickenWings],
    toppings: [
      { name: 'Extra Sauce', price: 1.0 },
      { name: 'Blue Cheese', price: 0.5 },
      { name: 'Hot Sauce', price: 0.75 },
    ],
    sides: [
      { name: 'Fries', price: 3.5 },
      { name: 'Celery', price: 1.0 },
      { name: 'Ranch', price: 0.5 },
    ],
  },
  {
    id: 6,
    title: 'PASTA PRIMAVERA',
    image: pasta,
    color: '#2E8B57',
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.4,
    calories: 720,
    description:
      'Fresh pasta with seasonal vegetables, garlic, olive oil, and parmesan cheese. A healthy Italian classic!',
    images: [pasta],
    toppings: [
      { name: 'Extra Parmesan', price: 1.5 },
      { name: 'Chicken', price: 3.0 },
      { name: 'Shrimp', price: 4.0 },
    ],
    sides: [
      { name: 'Garlic Bread', price: 4.0 },
      { name: 'Salad', price: 4.5 },
      { name: 'Soup', price: 3.0 },
    ],
  },
]

export const sides = [
  {
    name: 'Fries',
    image: fries,
    price: 3.5,
  },
  {
    name: 'Onion Rings',
    image: onionRings,
    price: 4.0,
  },
  {
    name: 'Mozarella Sticks',
    image: mozarellaSticks,
    price: 5.0,
  },
  {
    name: 'Coleslaw',
    image: coleslaw,
    price: 2.5,
  },
  {
    name: 'Salad',
    image: salad,
    price: 4.5,
  },
]

export const toppings = [
  {
    name: 'Avocado',
    image: avocado,
    price: 1.5,
  },
  {
    name: 'Bacon',
    image: bacon,
    price: 2.0,
  },
  {
    name: 'Cheese',
    image: cheese,
    price: 1.0,
  },
  {
    name: 'Cucumber',
    image: cucumber,
    price: 0.5,
  },
  {
    name: 'Mushrooms',
    image: mushrooms,
    price: 1.2,
  },
  {
    name: 'Onions',
    image: onions,
    price: 0.5,
  },
  {
    name: 'Tomatoes',
    image: tomatoes,
    price: 0.7,
  },
]

export const images = {
  avatar,
  avocado,
  bacon,
  burgerOne,
  burgerTwo,
  burgerImage,
  buritto,
  cheese,
  chickenWings,
  coleslaw,
  cucumber,
  emptyState,
  fries,
  loginGraphic,
  logo,
  mozarellaSticks,
  mushrooms,
  onionRings,
  onions,
  pasta,
  pizzaOne,
  salad,
  signup,
  success,
  tomatoes,
  arrowBack,
  arrowDown,
  arrowRight,
  bag,
  check,
  clock,
  dollar,
  envelope,
  home,
  location,
  logout,
  minus,
  pencil,
  person,
  phone,
  plus,
  search,
  star,
  trash,
  user,
}
