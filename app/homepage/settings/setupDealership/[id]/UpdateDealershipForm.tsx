'use client'

import HeaderTitle from "@/components/HeaderTitle";
import { updateDealership } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { Dealership } from "@prisma/client"
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoCarSport } from "react-icons/io5";
import { toast } from "react-toastify"
import BreadCrumbs from "./BreadCrumbs";

const UpdateDealershipForm = ({ dealership, dealershipError, adminError }: { dealership: Dealership, dealershipError: String, adminError: String }) => {

    useEffect(() => {
        if (dealershipError || adminError) {
            toast.error(dealershipError || adminError);
            redirect('/homepage')
        }
    } , [dealershipError, adminError]);

    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter();

    const clientAction = async (formData: FormData): Promise<void> => {

        // Add action to update dealership details
        const name = formData.get('name') as string;
        const address1 = formData.get('address1') as string;
        const address2 = formData.get('address2') as string;
        const mobile = formData.get('mobile') as string;
        const landline = formData.get('landline') as string;
        const contactPerson = formData.get('contactPerson') as string;

        if (dealership?.id) {
            const { error } = await updateDealership(dealership.id, name, address1, address2, mobile, landline, contactPerson);
            if (error) {
                toast.error(error);
            } else {
                toast.success("Dealership updated successfully");
                redirect('/homepage/settings/setupDealership')
            }
        } else {
            toast.error("Dealership ID is missing");
        }
    }

    const handleGoBack = () => {
        router.back()
    };

    return (
        <div className="container">
            <ClerkLoaded>
                <HeaderTitle Icon={IoCarSport} title='Edit Dealership' />
                <section className="form">
                    <BreadCrumbs />
                    <form ref={formRef} action={clientAction} noValidate>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="name">Name:</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={dealership.name}
                                required
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="address1">Address 1:</label>
                            <input
                                type="text"
                                name="address1"
                                id="address1"
                                defaultValue={dealership.address1}
                                required
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="address2">Address 2:</label>
                            <input
                                type="text"
                                name="address2"
                                id="address2"
                                defaultValue={dealership.address2 || ''}
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="landline">Landline:</label>
                            <input
                                type="text"
                                name="landline"
                                id="landline"
                                defaultValue={dealership.landline || ''}
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="mobile">Mobile:</label>
                            <input
                                type="text"
                                name="mobile"
                                id="mobile"
                                defaultValue={dealership.mobile || ''}
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="contactPerson">Contact:</label>
                            <input
                                type="text"
                                name="contactPerson"
                                id="contactPerson"
                                defaultValue={dealership.contactPerson || ''}
                            />
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
        </div >
    )
}

export default UpdateDealershipForm
