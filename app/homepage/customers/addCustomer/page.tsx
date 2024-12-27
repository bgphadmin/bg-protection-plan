'use client'
import React from 'react'
import AddCustomerForm from './AddCustomerForm'
import { FaUser } from 'react-icons/fa'
import HeaderTitle from '@/components/HeaderTitle'


export default function AddCustomerPage() {
    return (
        <div className="container">
            <HeaderTitle Icon={FaUser} title="Add Customer" />    
            <AddCustomerForm />
        </div>
    )
}
