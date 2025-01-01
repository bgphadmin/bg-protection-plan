
import React from 'react'
import AddCustomerForm from './AddCustomerForm'
import { isAdminMainDealership } from '@/lib/actions'


export default async function AddCustomerPage() {

    // Check if role og logged in user is admin main or dealership
    const { error } = await isAdminMainDealership()

    return (
        <div className="container">
            <AddCustomerForm error={error ?? ''} />
        </div>
    )
}
