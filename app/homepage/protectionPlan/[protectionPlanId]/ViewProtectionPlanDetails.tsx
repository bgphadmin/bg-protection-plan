'use client'

import { ExtendedProtectionPlan } from '@/lib/actions'
import { ClerkLoaded } from '@clerk/nextjs'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ViewProtectionPlanDetails = ({ protectionPlan, error }: { protectionPlan: ExtendedProtectionPlan, error?: string }) => {

    if (error) {
        toast.error(error);
        return;
    }

    const [enlarged, setEnlarged] = useState(false);

    // Get value for expiration status of protection plan
    const checkExpirationStatus = (protectionPlan: ExtendedProtectionPlan) => {
        const currentDate = new Date();
        const expiryDate = new Date(protectionPlan.expiryDate);
        const diffTime = expiryDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) {
            return 'black'; // expired
        } else if (diffDays <= 7) {
            return 'red'; // about to expire (less than 7 days)
        } else if (diffDays <= 30) {
            return 'yellow'; // expiring soon (less than 30 days)
        } else {
            return 'green'; // not expiring soon (more than 30 days)
        }
    };

    return (
        <div style={{ alignItems: 'center', textAlign: 'center' }}>
            <ClerkLoaded>
                <section className="form pt-8">
                    {/* <BreadCrumbs /> */}
                    <div>
                        {/* <h2 className="bg-amber-100" >Protection Plan Details</h2> */}
                        <h1>PROTECTION PLAN DETAILS - {protectionPlan.claimed ? <span style={{ color: 'blue' }}>CLAIMED</span> : checkExpirationStatus(protectionPlan) === 'black' ? <span style={{ color: 'red' }}>EXPIRED</span> : <span style={{ color: 'green' }}> ACTIVE</span>}</h1>
                        <ul className="vehicle-details-list">
                            <li className="bg-amber-100">
                                <strong>Owner:</strong> {protectionPlan.customer.fName + ' ' + protectionPlan.customer.lName}
                            </li>
                            <li>
                                <strong>Model/Make:</strong> {protectionPlan.customerVehicle.make + ' ' + protectionPlan.customerVehicle.model}
                            </li>
                            <li className="bg-amber-100">
                                <strong>Invoice No.:</strong> {protectionPlan.invoice}
                            </li>
                            <li>
                                <strong>BG Product:</strong> {protectionPlan.productUsed}
                            </li>
                            <li className="bg-amber-100">
                                <strong>Service Date:</strong> {protectionPlan.serviceDate && new Date(protectionPlan.serviceDate).toLocaleDateString()}
                            </li>
                            <li>
                                <strong>Expiry Date:</strong> {protectionPlan.expiryDate && new Date(protectionPlan.expiryDate).toLocaleDateString()}
                            </li>
                            <li className="bg-amber-100">
                                <strong>Odometer Initial Reading: </strong> {protectionPlan.odometerFrom}
                            </li>
                            <li>
                                <strong>Odometer Expiry Reading: </strong> {protectionPlan.odometerTo}
                            </li>
                            <li className="bg-amber-100">
                                <strong>Reimubursement: </strong> Up to {protectionPlan.reimbursement}
                            </li>
                            <li>
                                <strong>Service Interval: </strong>
                                <div className="bg-amber-100">
                                    {protectionPlan.serviceInterval}
                                </div>
                            </li>
                            <li>
                                <strong>Coverage: </strong>
                                <div className="bg-amber-100">
                                    {protectionPlan.covers}
                                </div>
                            </li>
                            <li>
                                <div>
                                    <img
                                        className={`invoiceImg ${enlarged ? 'enlarged' : ''}`}
                                        src={protectionPlan.invoiceUrl}
                                        alt="invoice"
                                        onClick={() => setEnlarged(!enlarged)}
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </ClerkLoaded>

        </div>
    )
}

export default ViewProtectionPlanDetails
