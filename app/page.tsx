'use server'

import React, { Suspense } from 'react'
import Guest from '@/components/Guest'
import Spinner from '@/components/Spinner'
import { emailScheduler } from '@/components/emailScheduler/emailScheduler'

const LandingPage = () => {


  // TODO: Add the email scheduler here...
  // emailScheduler();
  
  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Suspense fallback={<Spinner />} >
        <Guest />
      </Suspense>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(/BG_PH_Flag.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.3, // adjust the opacity value to change the transparency
      }} />

    </div>
  )
}

export default LandingPage
