'use client';

import HeaderTitle from "@/components/HeaderTitle";
import { ExtendedCustomerVehicle } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { Container } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { IoCarSportSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import BreadCrumbs from "./BreadCrumbs";

const CustomerVehicleGrid = ({ vehicles, error }: { vehicles: ExtendedCustomerVehicle[], error: string }) => {

    useEffect(() => {
        if (error) {
            toast.error(error)
            redirect('/homepage')
        }
    }, [error])

    const rows = vehicles?.map((vehicle: ExtendedCustomerVehicle) => ({
        id: vehicle.id,
        owner: vehicle.customer.fName + ' ' + vehicle.customer.lName,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        plateNo: vehicle.plateNo,
        registration: vehicle.registration,
        transmission: vehicle.transmission,
        fuelEngineType: vehicle.fuelEngineType,
        mileage: vehicle.mileage,
    }))

    const columns = [
        { field: "owner", width: 150, headerName: 'Owner' },
        { field: "make", width: 150, headerName: 'Make' },
        { field: "model", width: 150, headerName: 'Model' },
        { field: "year", width: 150, headerName: 'Year' },
        { field: "vin", width: 150, headerName: 'VIN' },
        { field: "plateNo", width: 150, headerName: 'Plate No' },
        { field: "registration", width: 150, headerName: 'Registration' },
        { field: "transmission", width: 150, headerName: 'Transmission' },
        { field: "fuelEngineType", width: 150, headerName: 'Fuel/Engine Type' },
        { field: "mileage", width: 150, headerName: 'Mileage' },
    ]

    const CustomToolbar = () => {
        return (
            <ClerkLoaded>
                <GridToolbarContainer style={{ marginTop: '0.5rem' }}>
                    <div style={{ flexWrap: 'wrap', flexDirection: 'row', display: 'flex', alignContent: 'center', columnGap: '23rem' }}>
                        <div style={{ margin: 'auto', color: 'inherit' }} >
                            <GridToolbarColumnsButton slotProps={{ button: { color: 'inherit' } }} />
                            <GridToolbarFilterButton slotProps={{ button: { color: 'inherit' } }} />
                            <GridToolbarExport slotProps={{ button: { color: 'inherit' } }} />
                        </div>
                    </div>
                </GridToolbarContainer>
            </ClerkLoaded>
        )
    }
    return (
        <div>
            <Container style={{ height: 400, width: '100%' }} >
                <HeaderTitle Icon={IoCarSportSharp} title="Vehicles" />
                <BreadCrumbs />
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 20, 100]}
                    density='standard'
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 20, page: 0 },
                        },
                    }}
                    className="dark:text-white dark:bg-blue-900 diplay: flex justify-center"
                    // onRowClick={handleRowClick}
                />
            </Container>

        </div>
    )
}

export default CustomerVehicleGrid