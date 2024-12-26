'use client'
import React, { Suspense } from 'react'
import AddCustomerForm from './AddCustomerForm'
import { FaUser } from 'react-icons/fa'
import AddCustomerTitle from './AddCustomerTitle'


export default function AddCustomerPage() {
    return (
        <div className="container">
            <AddCustomerTitle />    
            <AddCustomerForm />
        </div>
    )
}
