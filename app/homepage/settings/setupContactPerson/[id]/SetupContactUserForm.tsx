'use client'

import HeaderTitle from "@/components/HeaderTitle";
import { updateRoleAndDealership } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { MenuItem, TextField } from "@mui/material";
import { Dealership, Role, User } from "@prisma/client"
import { redirect, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { toast } from "react-toastify"
import BreadCrumbs from "../BreadCrumbs";

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
            const { error } = await updateRoleAndDealership(user.id, role, dealershipId || '');
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
        <div>
            <ClerkLoaded>
                <HeaderTitle Icon={BsPersonFillCheck} title={titleName} />
                <section className="form">
                    <form ref={formRef} action={clientAction} noValidate>
                        <div className="form-group">
                            <TextField
                                id="role"
                                select
                                label="User Role"
                                defaultValue=""
                                helperText="Please select User's Role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                name='role'
                                sx={{ mb: '0.75rem', mr: '0.75rem' }}
                            >
                                {roles!.map((role) => (
                                    <MenuItem key={role.id} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className="form-group">
                            <TextField
                                id="dealershipId"
                                select
                                label="Dealership Name"
                                defaultValue=""
                                helperText="Please select Dealership Name"
                                value={dealershipId}
                                onChange={(e) => setDealershipId(e.target.value)}
                                name='dealershipId'
                                sx={{ mb: '0.75rem', mr: '0.75rem' }}
                            >
                                {dealerships!.map((dealership) => (
                                    <MenuItem key={dealership.id} value={dealership.id}>
                                        {dealership.id} - {dealership.name}
                                    </MenuItem>
                                ))}
                            </TextField>
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
