'use client'

import HeaderTitle from '@/components/HeaderTitle';
import { ExtendedProtectionPlan } from '@/lib/actions';
import { ClerkLoaded } from '@clerk/nextjs';
import { Autocomplete, Container, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { redirect } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { IoCarSportSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { StripedDataGrid } from '@/lib/utils';

const ProtectionPlanGrid = ({ plans, error }: { plans: ExtendedProtectionPlan[], error: string }) => {

    if (error) {
        toast.error(error);
        return;
    }

    const [expired, setExpired] = useState(false);

    // Check expiration status
    const checkExpirationStatus = (protectionPlan: ExtendedProtectionPlan) => {
        const currentDate = new Date();
        const expiryDate = new Date(protectionPlan.expiryDate);
        const diffTime = expiryDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0 || protectionPlan.claimed) {
            return 'black'; // expired
        } else if (diffDays <= 7) {
            return 'red'; // about to expire (less than 7 days)
        } else if (diffDays <= 30) {
            return 'yellow'; // expiring soon (less than 30 days)
        } else {
            return 'green'; // not expiring soon (more than 30 days)
        }
    };

    // Get customer's first name and the vehicle make and plate no for autocomplete dropdown options
    const selectedValues = useMemo(() => {
        const sortedValues = plans?.map((plan) => plan.customer.fName + ' ' + plan.customer.lName + ' ' + plan.customerVehicle.make + ' ' + plan.customerVehicle.plateNo + ' ' + plan.invoice);
        return sortedValues.sort((a, b) => {
            const fNameA = a.split(' ')[0];
            const fNameB = b.split(' ')[0];
            return fNameA.localeCompare(fNameB);
        });
    }, [plans]);

    const [firstNameMakePlate, setFirstNameMakePlate] = useState<string | null>(null);

    // Get vehicle list by customer's first name and the vehicle make, model and plate no
    const filteredProtectionPlans = useMemo(() => {
        if (firstNameMakePlate) {
            // split first name and make and plate no
            const [firstName, lastName, make, plate, invoice] = firstNameMakePlate.split(' ');
            return plans?.filter((plan) => plan.customer.fName === firstName && plan.customer.lName === lastName && plan.customerVehicle.make === make && plan.customerVehicle.plateNo === plate && plan.invoice === invoice);
        } else {
            return plans;
        }
    }, [firstNameMakePlate, plans]);


    // create a mui x-grid for protection plans
    const rows = filteredProtectionPlans.map((plan: ExtendedProtectionPlan) => ({
        id: plan.id,
        // Added expiration status
        expirationStatus: checkExpirationStatus(plan),
        claimed: plan.claimed,
        owner: plan.customer.fName + ' ' + plan.customer.lName,
        make: plan.customerVehicle.make,
        model: plan.customerVehicle.model,
        plateNo: plan.customerVehicle.plateNo,
        productUsed: plan.productUsed,
        invoice: plan.invoice,
        serviceDate: plan.serviceDate,
        odometerTo: plan.odometerTo,
        expired: checkExpirationStatus(plan) === 'black' ? true : false,
        expiryDate: plan.expiryDate,
        reimbursement: plan.reimbursement
    }));


    const columns: GridColDef[] = [
        {
            field: 'expirationStatus',
            headerName: 'Status',
            renderCell: (params: any) => {
                const color = checkExpirationStatus(params.row);
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: color,
                            }}
                        />
                    </div>
                );
            },
        },
        {
            field: 'claimed',
            headerName: 'Claimed',
            width: 150,
            renderCell: (params: any) => {
                return (
                    <div>
                        {params.row.claimed ? 'Yes' : 'No'}
                    </div>
                )
            },
        },
        { field: "owner", width: 150, headerName: 'Owner' },
        { field: 'make', headerName: 'Make', width: 150 },
        { field: 'model', headerName: 'Model', width: 150 },
        { field: 'plateNo', headerName: 'Plate No', width: 150 },
        { field: 'productUsed', headerName: 'Product Used', width: 150 },
        { field: 'invoice', headerName: 'Invoice', width: 150 },
        { field: 'serviceDate', headerName: 'Service Date', width: 150 },
        { field: 'odometerTo', headerName: 'Odometer End', width: 150 },
        { field: 'expired', headerName: 'Expired', width: 150 },
        { field: 'expiryDate', headerName: "Expiry Date", width: 150 },
        { field: 'reimbursement', headerName: "Reimbursement", width: 150 }
    ];


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
                                sx={{ width: 320, mr: 1, ml: 1 }}
                                renderInput={(params) => <TextField {...params} label="Search" />}
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
    const handleRowClick = (params: GridRowParams) => {
        redirect(`/homepage/protectionPlan/${params.id}`);
    }

    return (
        <Container style={{ height: 400, width: '100%', marginTop: '2rem' }} >
            <div className="flex justify-between items-center">
                <HeaderTitle Icon={IoCarSportSharp} title={`Customer Vehicle Protection Plan`} />
            </div>
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
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                className="dark:text-white dark:bg-blue-900 diplay: flex justify-center"
                onRowClick={handleRowClick}
            />
        </Container>
    )
}

export default ProtectionPlanGrid
