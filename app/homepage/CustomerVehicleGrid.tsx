'use client';

import HeaderTitle from "@/components/HeaderTitle";
import { ExtendedCustomerVehicle, isAdmin } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { Autocomplete, Container, TextField } from "@mui/material";
import { DataGrid, GridRowParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoCarSportSharp } from "react-icons/io5";
import { toast } from "react-toastify";
// import BreadCrumbs from "./BreadCrumbs";

const CustomerVehicleGrid = ({ vehicles, error, isAdmin }: { vehicles: ExtendedCustomerVehicle[], error: string, isAdmin: boolean }) => {

    useEffect(() => {
        if (error) {
            toast.error(error)
            redirect('/homepage')
        }
    }, [error])

    // Get customer's first name and the vehicle make and plate no for autocomplete dropdown options
    const selectedValues = useMemo(() => {
        const sortedValues = vehicles?.map((vehicle) => vehicle.customer.fName + ' ' + vehicle.make + ' ' + vehicle.plateNo);
        return sortedValues.sort((a, b) => {
            const fNameA = a.split(' ')[0];
            const fNameB = b.split(' ')[0];
            return fNameA.localeCompare(fNameB);
        });
    }, [vehicles]);

    const [firstNameMakePlate, setFirstNameMakePlate] = useState<string | null>(null);

    // Get vehicle list by customer's first name and the vehicle make
    const filteredVehicles = useMemo(() => {
        if (firstNameMakePlate) {
            // split first name and make and plate no
            const [firstName, make, plate] = firstNameMakePlate.split(' ');
            return vehicles?.filter((vehicle) => vehicle.customer.fName === firstName && vehicle.make === make && vehicle.plateNo === plate);
        } else {
            return vehicles;
        }
    }, [firstNameMakePlate, vehicles]);

    const rows = filteredVehicles?.map((vehicle: ExtendedCustomerVehicle) => ({
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
            { field: "plateNo", width: 100, headerName: 'Plate No' },
            { field: "year", width: 75, headerName: 'Year' },
            { field: "dealerships", width: 150, headerName: 'Dealership' },
        ]
    } else {
        columns = [
            { field: "owner", width: 150, headerName: 'Owner' },
            { field: "make", width: 150, headerName: 'Make' },
            { field: "model", width: 150, headerName: 'Model' },
            { field: "plateNo", width: 100, headerName: 'Plate No' },
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
                    <div style={{ marginRight: 'auto', justifySelf: 'end', flexDirection: 'row', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', flexShrink: 'inherit' }}>
                        <>
                            <Autocomplete
                                value={firstNameMakePlate}
                                onChange={(event: any, newValue: string | null) => {
                                    setFirstNameMakePlate(newValue);
                                }}
                                id="controllable-states-demo"
                                options={selectedValues}
                                sx={{ width: 300, mr: 1, ml: 1 }}
                                renderInput={(params) => <TextField {...params} label="User" />}
                                isOptionEqualToValue={(option, value) => option.valueOf === value.valueOf}
                            />
                        </>
                    </div>
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
                    <HeaderTitle Icon={IoCarSportSharp} title={`Customer Vehicles`} />
                </div>
                {/* <BreadCrumbs /> */}
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
                    onRowClick={(params) => {
                        handleRowClick(params);
                    }}
                />
            </Container>
        </div>
    )
}

export default CustomerVehicleGrid