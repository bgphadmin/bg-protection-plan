'use client';

import HeaderTitle from "@/components/HeaderTitle";
import { ExtendedCustomerVehicle, isAdmin } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { Container } from "@mui/material";
import { DataGrid, GridRowParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { IoCarSportSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import BreadCrumbs from "./BreadCrumbs";
import { StripedDataGrid } from "@/lib/utils";

// const CustomerVehicleGrid = ({ vehicles, error, customerId }: { vehicles: ExtendedCustomerVehicle[], error: string, customerId: string }) => {
const CustomerVehicleGrid = ({ vehicles, error, isAdmin }: { vehicles: ExtendedCustomerVehicle[], error: string, isAdmin: boolean }) => {

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
        transmission: vehicle.transmission,
        fuelEngineType: vehicle.fuelEngineType,
        dealerships: vehicle.dealerships?.name
    }))

    // check to include dealership column if user is admin
    let columns: any
    if (isAdmin) {
        columns = [
            { field: "owner", width: 150, headerName: 'Owner' },
            { field: "make", width: 150, headerName: 'Make' },
            { field: "model", width: 150, headerName: 'Model' },
            { field: "year", width: 75, headerName: 'Year' },
            { field: "dealerships", width: 150, headerName: 'Dealership' },
        ]
    } else {
        columns = [
            { field: "owner", width: 150, headerName: 'Owner' },
            { field: "make", width: 150, headerName: 'Make' },
            { field: "model", width: 150, headerName: 'Model' },
            { field: "year", width: 75, headerName: 'Year' },
        ]
    }


    const handleRowClick = (params: GridRowParams) => {
        redirect(`/homepage/customers/customerVehicles/${params.row.id}/viewVehicle`);
    }

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
                <div className="flex justify-between items-center">
                    <HeaderTitle Icon={IoCarSportSharp} title={`Vehicles`} />
                </div>
                <BreadCrumbs />
                <StripedDataGrid
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
                    onRowClick={(params) => {
                        handleRowClick(params);
                    }}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                />
            </Container>
        </div>
    )
}

export default CustomerVehicleGrid