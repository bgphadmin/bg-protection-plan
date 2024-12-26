'use client'

import React from "react";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Container, Typography } from "@mui/material";
import { toast } from "react-toastify";
import BreadCrumbs from "./BreadCrumbs";
import { ClerkLoaded } from "@clerk/nextjs";

type RowForm = {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    dealershipName?: string | null;
    email: string;
    mobile: string;
    createdAt: Date;
}

const CustomerGrid = ({ customers, error, isAdmin }: { customers?: any, error?: string, isAdmin?: boolean }) => {

    if (error) {
        toast.error(error);
        return null
    }

    const rows = customers?.map((customer: { id: string; fName: string; lName: string; dealership: { name: string; }; email: string; mobile: string; createdAt: Date; }): RowForm => ({
        id: customer?.id || "",
        firstName: customer?.fName,
        lastName: customer?.lName,
        dealershipName: customer?.dealership?.name,
        email: customer?.email,
        mobile: customer?.mobile,
        createdAt: customer?.createdAt
    }));

    const columns = [
        { field: "firstName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'First Name'}</Typography>, },
        { field: "lastName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Last Name'}</Typography>, },
        { field: "dealershipName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Dealership'}</Typography>, },
        { field: "email", width: 250, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Email'}</Typography>, },
        { field: "mobile", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Mobile'}</Typography>, },
        { field: "createdAt", width: 200, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Date Registered'}</Typography>, },
    ];

    const handleRowClick = async (params: any) => {
        const id = await params.row.clerkId;
        location.href = `/customers/${id}`
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
        <Container style={{ height: 400, width: '100%', }} >
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
                onRowClick={handleRowClick}

            />
        </Container>
    );
}

export default CustomerGrid
