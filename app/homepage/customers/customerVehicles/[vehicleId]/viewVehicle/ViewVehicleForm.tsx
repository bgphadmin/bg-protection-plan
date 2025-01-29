'use client'

import HeaderTitle from "@/components/HeaderTitle"
import { ClerkLoaded } from "@clerk/nextjs"
import BreadCrumbs from "./BreadCrumbs";
import { SyntheticEvent, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ExtendedCustomerVehicle } from "@/lib/actions";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import { Button } from "@/components/ui/button";
import ProtectionPlanGrid from "./ProtectionPlanGrid";


const ViewVehicleForm = ({ vehicle, error }: { vehicle?: ExtendedCustomerVehicle, error?: string }) => {

    if (error) {
        toast.error(error, { theme: "colored" });
        redirect('/homepage/customers/customerVehicles');
    }

    if (!vehicle) {
        toast.error('Vehicle not found', { theme: "colored" });
        return null;
    }

    const [expanded, setExpanded] = useState<string | false>(false);
    const router = useRouter();

    const handleChange =
        (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const handleGoBack = () => {
        router.back()
    };

    return (
        <div style={{ alignItems: 'center', textAlign: 'center' }}>
            <ClerkLoaded>
                <section className="form pt-8">
                    <BreadCrumbs />
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
                        <AccordionSummary
                            expandIcon={<MdExpandMore />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'navy',
                                fontWeight: 'medium',
                                fontSize: '1.25rem',
                                textAlign: 'center',

                            }}>
                                <HeaderTitle title={`${vehicle.customer?.fName} ${vehicle.customer.lName} - ${vehicle.make} ${vehicle.model}`} />
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
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
                        </AccordionDetails>
                    </Accordion>
                    <Button 
                        className="bg-amber-200 text-black hover:text-white mt-2 w-11/12 h-12 "
                        onClick={() => redirect(`/homepage/customers/customerVehicles/${vehicle.id}/protectionPlan/addProtectionPlan`)}
                    >
                        Add Protection Plan
                    </Button>
                    <ProtectionPlanGrid vehicleId={vehicle.id} />       
                </section>
            </ClerkLoaded>

        </div>
    )
}

export default ViewVehicleForm
