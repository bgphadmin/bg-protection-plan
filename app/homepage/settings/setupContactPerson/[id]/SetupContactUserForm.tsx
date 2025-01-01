'use client'

import HeaderTitle from "@/components/HeaderTitle";
import { updateRoleAndDealership } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { Dealership, Role, User } from "@prisma/client"
import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { toast } from "react-toastify"
import BreadCrumbs from "./BreadCrumbs";

const SetupContactUserForm = ({ user, error, roles, dealerships }: { user?: User, error?: string, roles?: Role[], dealerships?: Dealership[] }) => {

    if (error) {
        toast.error(error);
        redirect('/homepage')
    }

    const formRef = useRef<HTMLFormElement>(null)
    const router = useRouter();

    const [role, setRole] = useState(user?.role);
    const [dealershipId, setDealershipId] = useState(user?.dealershipId);
    const [firstName] = useState(user?.firstName);
    const [lastName] = useState(user?.lastName);
    const titleName = `${firstName} ${lastName}`

    const clientAction = async (formData: FormData): Promise<void> => {
        // Add action to update user's role and dealership
        const role = formData.get('role') as string;
        const dealership = formData.get('dealershipId') as string;

        if (user?.id) {
            const { error } = await updateRoleAndDealership(user.id, role, dealership || '');
            if (error) {
                toast.error(error);
            } else {
                toast.success("User contact updated successfully");
                redirect('/homepage/settings/setupContactPerson')
            }
        } else {
            toast.error("User ID is missing");
        }

    }

    const handleGoBack = () => {
        router.back()
    };

    return (
        <div className="container">
            <ClerkLoaded>
                <HeaderTitle Icon={BsPersonFillCheck} title={titleName} />
                <section className="form">
                <BreadCrumbs />
                    <form ref={formRef} action={clientAction} noValidate>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="role">ROLE:</label>
                            <select
                                id="role"
                                required
                                className="fom-control"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                name='role'
                            >
                                <option value="" disabled>Select a role</option>
                                {roles!.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group flex items-center">
                            <label className="pr-2" htmlFor="dealershipId">SHOP:</label>
                            <select
                                id="dealershipId"
                                required
                                value={dealershipId ?? ''}
                                onChange={(e) => setDealershipId(Number(e.target.value))}
                                name='dealershipId'
                                className="fom-control"
                                
                            >
                                <option value="" disabled className="text-gray">Select a shop</option>
                                {dealerships!.map((dealership) => (
                                    <option key={dealership.id} value={dealership.id}>
                                        {dealership.id} - {dealership.name}
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

export default SetupContactUserForm
