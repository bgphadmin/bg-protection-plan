'use client'

import { useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react'

const Homepage = () => {

    const router = useRouter();
    useEffect(()=> {
        router.push('/homepage');
    },[])
   
    return null
}

export default Homepage
