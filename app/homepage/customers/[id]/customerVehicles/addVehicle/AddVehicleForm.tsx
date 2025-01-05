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
import { addCustomerVehicle } from "@/lib/actions";


const AddVehicleForm = ({customerId}: {customerId: string}) => {

    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter();

    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')
    const [vin, setVin] = useState('')
    const [plateNo, setPlateNo] = useState('')
    const [transmission, setTransmission] = useState('')
    const [fuelType, setFuelType] = useState('')


    const clientAction = async (formData: FormData): Promise<void> => {

        // Add action to add customer
        const make = formData.get('make') as string;
        const model = formData.get('model') as string;
        const year = formData.get('year') as string;
        const vin = formData.get('vin') as string;
        const plateNo = formData.get('plateNo') as string;
        const transmission = formData.get('transmission') as string;
        const fuelType = formData.get('fuelType') as string;

        if (!make || !model || !year || !vin || !plateNo || !transmission || !fuelType) {
            toast.error('All fields are required')
        }
        
        const { error } =  await addCustomerVehicle(formData, customerId)

        if (error) {
            toast.error(error)
        } else {
            toast.success('Customer vehicle added successfully')
            formRef.current?.reset()
            redirect(`/homepage/customers/${customerId}/customerVehicles`)
        }
    }

    const handleGoBack = () => {
        router.back()
    };

    return (
        <div className="container">
            <ClerkLoaded>
                <HeaderTitle Icon={BiSolidCarGarage} title="Add Vehicle" />
                <section className="form">
                    <BreadCrumbs />
                    <form  ref={formRef} action={clientAction} noValidate>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="make"
                                value={make}
                                name="make"
                                onChange={(e) => setMake(e.target.value)}
                                placeholder="Enter your car make" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="model"
                                value={model}
                                name="model"
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="Enter your car model" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="vin"
                                value={vin}
                                name="vin"
                                onChange={(e) => setVin(e.target.value)}
                                placeholder="Enter your car vin" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="plateNo"
                                value={plateNo}
                                name="plateNo"
                                onChange={(e) => setPlateNo(e.target.value)}
                                placeholder="Enter your car plate number" />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                required
                                id="year"
                                value={year}
                                name="year"
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="Enter your car year" />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="transmission">Transmission:</label>
                            <select
                                id="transmission"
                                required
                                className="fom-control"
                                value={transmission}
                                onChange={(e) => setTransmission(e.target.value)}
                                name='transmission'
                            >
                                <option value="" disabled>Select transmission</option>
                                {transmissionTypes.map((transmission) => (
                                    <option key={transmission.id} value={transmission.name}>
                                        {transmission.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="fuelType">Fuel Type:</label>
                            <select
                                id="fuelType"
                                required
                                className="fom-control"
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                name='fuelType'
                            >
                                <option value="" disabled>Select fuel type</option>
                                {fuelTypes.map((fuelType) => (
                                    <option key={fuelType.id} value={fuelType.name}>
                                        {fuelType.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group gap-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleGoBack} className="btn btn-block" style={{ backgroundColor: 'black', color: 'white', }} type="reset">
                                Cancel
                            </button>
                            <button className="btn btn-block" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </section>
            </ClerkLoaded>
        </div>
    )
}

export default AddVehicleForm
