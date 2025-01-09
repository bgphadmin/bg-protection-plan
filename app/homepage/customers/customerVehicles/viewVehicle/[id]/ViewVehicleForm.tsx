'use client'

import HeaderTitle from "@/components/HeaderTitle"
import { ClerkLoaded } from "@clerk/nextjs"
import { BiSolidCarGarage } from "react-icons/bi";
import BreadCrumbs from "./BreadCrumbs";
import { useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CustomerVehicle } from "@prisma/client";
import transmissionTypes from "@/data/transmissionType.json";
import fuelTypes from "@/data/fuelEngineType.json";
import { addCustomerVehicle, ExtendedCustomerVehicle } from "@/lib/actions";


const ViewVehicleForm = ({ vehicle, error }: { vehicle?: ExtendedCustomerVehicle, error?: string }) => {

    if (error) {
        toast.error(error, { theme: "colored" });
        redirect('/homepage/customers/customerVehicles');
    }

    if (!vehicle) {
        toast.error('Vehicle not found', { theme: "colored" });
        return null;
    }

    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter();

    const handleGoBack = () => {
        router.back()
    };

    return (
        // TODO: Make the details in mui accordion component
        <div style={{alignItems: 'center', textAlign: 'center'}}>
            <ClerkLoaded>
                <HeaderTitle Icon={BiSolidCarGarage} title={`Owner: ${vehicle.customer?.fName} ${vehicle.customer.lName}`} />
                <section className="form">
                    <BreadCrumbs />
                    <div>
                        <h2 className="bg-amber-100" >Vehicle Details</h2>
                        <ul className="vehicle-details-list">
                            <li className="bg-gray-100">
                                <strong>Make:</strong> {vehicle.make}
                            </li>
                            <li>
                                <strong>Model:</strong> {vehicle.model}
                            </li>
                            <li className="bg-gray-100">
                                <strong>Year:</strong> {vehicle.year}
                            </li>
                            <li>
                                <strong>VIN:</strong> {vehicle.vin}
                            </li>
                            <li className="bg-gray-100">
                                <strong>Plate No:</strong> {vehicle.plateNo}
                            </li>
                            <li>
                                <strong>Transmission:</strong> {vehicle.transmission}
                            </li>
                            <li className="bg-gray-100">
                                <strong>Fuel Type:</strong> {vehicle.fuelEngineType}
                            </li>
                            <li>
                                <strong>Dealership:</strong> {vehicle.dealerships?.name}
                            </li>
                        </ul>
                    </div>
                </section>
            </ClerkLoaded>
            
        </div>
    )
}

export default ViewVehicleForm
