import React from 'react'
import { UserButton } from "@clerk/nextjs"

const HomePage = () => {
  return (
    <div className='pt-5'>
      <h1 className="dark:text-blue-200 text-3xl ">BG Vehicle Protection Plan</h1>
      <img src="/BG_logo.webp" alt="BG logo"  className="w-2/3 h-2/3 pt-0.25 m-auto mt-4" />
    </div>
  )
}

export default HomePage
