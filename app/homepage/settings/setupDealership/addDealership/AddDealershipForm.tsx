'use client'

import { redirect, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { ClerkLoaded } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { addCustomer, addDealership } from '@/lib/actions'

const AddDealershipForm = () => {

    // Add useState for Dealership fields
    const [name, setName] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [mobile, setMobile] = useState('')
    const [landline, setLandline] = useState('')
    const [contactPerson, setContactPerson] = useState('')


    const formRef = useRef<HTMLFormElement>(null)

    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const clientAction = async (formData: FormData): Promise<void> => {

        // const { error } = await addCustomer(formData)
        const { error } = await addDealership(formData)   

        if (error) {
            toast.error(error)
        } else {
            toast.success('Dealership added successfully')
            formRef.current?.reset()
            redirect('/homepage/settings/setupDealership')
        }
    }

    return (
        <ClerkLoaded>
            <section className="form">
                <form ref={formRef} action={clientAction} noValidate>
                    <div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="name"
                                value={name}
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Dealership name" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="address1"
                                value={address1}
                                name="address1"
                                onChange={(e) => setAddress1(e.target.value)}
                                placeholder="Enter Dealership address 1" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="address2"
                                value={address2}
                                name="address2"
                                onChange={(e) => setAddress2(e.target.value)}
                                placeholder="Enter Dealership address 2" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="contactPerson"
                                value={contactPerson}
                                name="contactPerson"
                                onChange={(e) => setContactPerson(e.target.value)}
                                placeholder="Enter contact person" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                required
                                id="mobile"
                                value={mobile}
                                name="mobile"
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter Dealership mobile number" />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="landline"
                                value={landline}
                                name="landline"
                                onChange={(e) => setLandline(e.target.value)}
                                placeholder="Enter Dealership landline number" />
                        </div>
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
    )
}

export default AddDealershipForm

