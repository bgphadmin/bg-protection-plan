'use client'

import HeaderTitle from "@/components/HeaderTitle";
import { ClerkLoaded } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { FaUserGear } from "react-icons/fa6";
import { CustomerDealership, updateCustomer } from "@/lib/actions";
import BreadCrumbs from "./BreadCrumbs";

interface UpdateCustomerFormProps {
    customer: CustomerDealership;
    error?: string;
}

const UpdateCustomerForm = ({ customer, error }: UpdateCustomerFormProps) => {
    if (error) {
        toast.error(error);
        redirect('/homepage')
    }

    const handleGoBack = () => {
        redirect('/homepage/customers')
    };

    const clientAction = async (formData: FormData): Promise<void> => {
        // Add action to update customer
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const mobile = formData.get('mobile') as string;
        const landline = formData.get('landline') as string;
        
        if (customer.id) {
            const { error } = await updateCustomer(customer.id, firstName, lastName, email, mobile, landline);
            if (error) {
                toast.error(error);
            } else {
                toast.success("Customer updated successfully");
                redirect('/homepage/customers')
            }
        } else {
            toast.error("Customer ID is missing");
        }

    }


    return (
        <div className="container">
            <ClerkLoaded>
                <HeaderTitle Icon={FaUserGear} title="Edit Customer" />
                <section className="form">
                    <BreadCrumbs />
                    <form action={clientAction} noValidate>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                defaultValue={customer.fName}
                                required
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                defaultValue={customer.lName}
                                required
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={customer.email}
                                required
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="mobile">Mobile:</label>
                            <input
                                type="tel"
                                name="mobile"
                                id="mobile"
                                defaultValue={customer.mobile}
                                required
                            />
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="landline">Landline:</label>
                            <input
                                type="text"
                                name="landline"
                                id="landline"
                                defaultValue={customer.landline ?? ''}
                                required
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

        </div>
    )
}

export default UpdateCustomerForm
