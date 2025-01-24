'use client'

import { ExtendedProtectionPlan } from '@/lib/actions'
import { ClerkLoaded } from '@clerk/nextjs'
import React, { useState } from 'react'

const ViewProtectionPlanDetails = ({ protectionPlan }: { protectionPlan: ExtendedProtectionPlan, error?: string }) => {

    const [enlarged, setEnlarged] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    return (
        <div style={{ alignItems: 'center', textAlign: 'center' }}>
            <ClerkLoaded>
                <section className="form pt-8">
                    {/* <BreadCrumbs /> */}
                    <div>
                        {/* <h2 className="bg-amber-100" >Protection Plan Details</h2> */}
                        <h1>PROTECTION PLAN DETAILS - {protectionPlan.customerVehicle.make.toUpperCase() + ' ' + protectionPlan.customerVehicle.model?.toUpperCase()}</h1>
                        <ul className="vehicle-details-list">
                            <li className="bg-amber-100">
                                <strong>Owner:</strong> {protectionPlan.customer.fName + ' ' + protectionPlan.customer.lName}
                            </li>
                            <li>
                                <strong>Invoice No.:</strong> {protectionPlan.invoice}
                            </li>
                            <li className="bg-amber-100">
                                <strong>BG Product:</strong> {protectionPlan.productUsed}
                            </li>
                            <li>
                                <strong>Service Date:</strong> {protectionPlan.serviceDate && new Date(protectionPlan.serviceDate).toLocaleDateString()}
                            </li>
                            <li className="bg-amber-100">
                                <strong>Expiry Date:</strong> {protectionPlan.expiryDate && new Date(protectionPlan.expiryDate).toLocaleDateString()}
                            </li>
                            <li>
                                <strong>Odometer Initial Reading: </strong> {protectionPlan.odometerFrom}
                            </li>
                            <li className="bg-amber-100">
                                <strong>Odometer Expiry Reading: </strong> {protectionPlan.odometerTo}
                            </li>
                            <li >
                                <strong>Reimubursement: </strong> Up to {protectionPlan.reimbursement}
                            </li>
                            <li>
                                <strong className="bg-amber-100">Service Interval: </strong>
                                <div>
                                    {protectionPlan.serviceInterval}
                                </div>
                            </li>
                            <li>
                                <strong className="bg-amber-100">Coverage: </strong>
                                <div>
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
