'use client'

import { redirect, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { ClerkLoaded } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { addCustomer } from '@/lib/actions'

const AddCustomerForm = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [landline, setLandline] = useState('')

    const formRef = useRef<HTMLFormElement>(null)

    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const clientAction = async (formData: FormData): Promise<void> => {

        const { error } = await addCustomer(formData)

        if (error) {
            toast.error(error)
        } else {
            toast.success('Customer added successfully')
            formRef.current?.reset()
            redirect('/homepage/customers')
        }
    }

    return (
        <ClerkLoaded>


            <section className="form">
                <form ref={formRef} action={clientAction} noValidate>
                    <div className="form-group">
                        <input
                            type="text"
                            required
                            id="firstName"
                            value={firstName}
                            name="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name" />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="lasttName"
                            value={lastName}
                            name="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name" />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            required
                            id="email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            required
                            id="mobile"
                            value={mobile}
                            name="mobile"
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Enter your mobile number" />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="landline"
                            value={landline}
                            name="landline"
                            onChange={(e) => setLandline(e.target.value)}
                            placeholder="Enter landline number" />
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

export default AddCustomerForm
