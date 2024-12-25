import React from 'react'
import HomePage from './HomePage'
import Navbar from '@/components/navbar/Navbar'
import BottomNavbar from '@/components/bottomNavbar/BottomNavbar'

const page = () => {
  return (
    <div className='container'>
      <Navbar />
      <HomePage />
      <BottomNavbar />
    </div>
  )
}
export default page
