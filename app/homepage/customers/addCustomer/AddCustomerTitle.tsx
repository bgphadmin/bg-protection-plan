'use client'
import React from 'react'
import { FaUser } from 'react-icons/fa'

const AddCustomerTitle = () => {
    return (
        <div className="container flex flex-col items-center justify-center min-w-screen">
            <section className="heading">
                <h1 className='text-2xl font-bold my-8 dark:text-blue-200 flex items-center'>
                    <FaUser className='mr-2' />
                    Add Customer
                </h1>
            </section>
        </div>
    )
}

export default AddCustomerTitle
