'use client'

import HeaderTitle from '@/components/HeaderTitle';
import { ExtendedCustomerVehicle, updateCustomerVehicle } from '@/lib/actions'
import { ClerkLoaded } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import fuelTypes from '@/data/fuelEngineType.json'
import transmissionTypes from '@/data/transmissionType.json'
import { BiSolidCarGarage } from 'react-icons/bi';
import BreadCrumbs from './BreadCrumbs';

const UpdateVehicleForm = ({ vehicle, error }: { vehicle?: ExtendedCustomerVehicle, error?: string }) => {

    useEffect(() => {
        if (error) {
            toast.error(error);
            redirect('/homepage');
        }
    }, [error]);

    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter();

    const [make, setMake] = useState(vehicle?.make)
    const [model, setModel] = useState(vehicle?.model)
    const [year, setYear] = useState(vehicle?.year)
    const [vin, setVin] = useState(vehicle?.vin)
    const [plateNo, setPlateNo] = useState(vehicle?.plateNo)
    const [transmission, setTransmission] = useState(vehicle?.transmission)
    const [fuelType, setFuelType] = useState(vehicle?.fuelEngineType)

    const handleGoBack = () => {
        redirect(`/homepage/customers/${vehicle?.customerId}/customerVehicles`);
    };

    const clientAction = async (formData: FormData): Promise<void> => {
        // Add action to update vehicle details
        const make = formData.get('make') as string;
        const model = formData.get('model') as string;
        const year = parseInt(formData.get('year') as string, 10);
        const vin = formData.get('vin') as string;
        const plateNo = formData.get('plateNo') as string;
        const transmission = formData.get('transmission') as string;
        const fuelType = formData.get('fuelType') as string;

        if (!make || !model || !year || !vin || !plateNo || !transmission || !fuelType) {
            toast.error('All fields are required');
            return; // Return early if any field is missing
        }

        const result = await updateCustomerVehicle(formData, vehicle?.id!);

        if (result && result.error) {
            toast.error(result.error);
        } else {
            toast.success('Vehicle updated successfully');
            formRef.current?.reset();
            router.push(`/homepage/customers/${vehicle?.customerId}/customerVehicles`);
        }
    };

    return (
        <ClerkLoaded>
            <div className='container'>
                <HeaderTitle Icon={BiSolidCarGarage} title="Update Vehicle" />
                <section className="form">
                    <BreadCrumbs id={vehicle?.customerId || ''}  />
                    <form ref={formRef} action={clientAction} noValidate>
                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="make">MAKE: </label>
                            <input type="text" name="make" id="make" value={make} onChange={(e) => setMake(e.target.value)} />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="model">MODEL: </label>
                            <input type="text" name="model" id="model" value={model || ''} onChange={(e) => setModel(e.target.value)} />
                        </div>

                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="year">YEAR: </label>
                            <input type="number" name="year" id="year" value={year || ''} onChange={(e) => setYear(parseInt(e.target.value))} />
                        </div>

                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="vin">VIN: </label>
                            <input type="text" name="vin" id="vin" value={vin || ''} onChange={(e) => setVin(e.target.value)} />
                        </div>

                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="plateNo">PLATE NO: </label>
                            <input type="text" name="plateNo" id="plateNo" value={plateNo} onChange={(e) => setPlateNo(e.target.value)} />
                        </div>

                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="transmission">TRANSMISSION: </label>
                            <select name="transmission" id="transmission" onChange={(e) => setTransmission(e.target.value)} value={transmission || ''}>
                                <option value="" disabled>Select a role</option>
                                {transmissionTypes!.map((type) => (
                                    <option key={type.id} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group flex items-center">
                            <label className="pr-2 w-1/4" htmlFor="fuelType">FUEL TYPE: </label>
                            <select name="fuelType" id="fuelType" onChange={(e) => setFuelType(e.target.value)} value={fuelType}>
                                <option value="" disabled>Select fuel type</option>
                                {fuelTypes!.map((type) => (
                                    <option key={type.id} value={type.name}>
                                        {type.name}
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
            </div>
        </ClerkLoaded >
    )
}

export default UpdateVehicleForm
