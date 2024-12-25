'use client'

import React from "react";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Avatar, Container, Typography } from "@mui/material";
import { User } from "@prisma/client";
import { toast } from "react-toastify";

type RowForm = {
    id: string;
    imageUrl: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    createdAt: Date;
    clerkId: string;
    totalPoints: number
}

const CustomerGrid = () => {

    // if (error) {
    //     toast.error(error);
    //     return
    // }

    // const rows = customersTotalPoints?.map((customer): RowForm => ({
    //     id: customer.totalPoints?.id || '',
    //     imageUrl: customer.totalPoints?.imageUrl || "",
    //     firstName: customer.totalPoints?.firstName,
    //     lastName: customer.totalPoints?.lastName,
    //     email: customer.totalPoints?.email || '',
    //     createdAt: customer.totalPoints!.createdAt,
    //     clerkId: customer.totalPoints?.clerkUserId || '',
    //     totalPoints: customer.totalPoints?.totalPoints || 0
    // }));

    const columns = [
        { field: "imageUrl", width: 70, renderHeader: () => <Typography sx={{ color: 'darkblue', }}></Typography>, renderCell: (params: any) => <Avatar sx={{ marginTop: '0.25rem', display: 'flex', justifyContent: 'center' }} src={params.row.imageUrl} />, },
        { field: "firstName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'First Name'}</Typography>, },
        { field: "lastName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Last Name'}</Typography>, },
        { field: "email", width: 250, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Email'}</Typography>, },
        { field: "createdAt", width: 200, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Date Registered'}</Typography>, },
        { field: "totalPoints", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Total Points'}</Typography>, },
    ];

    const handleRowClick = async (params: any) => {
        const id = await params.row.clerkId;
        location.href = `/customers/${id}`
    }

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer style={{ marginTop: '0.5rem' }}>
                <div style={{ flexWrap: 'wrap', flexDirection: 'row', display: 'flex', alignContent: 'center', columnGap: '23rem' }}>
                    <div style={{ margin: 'auto', color: 'inherit' }} >
                        <GridToolbarColumnsButton slotProps={{ button: { color: 'inherit' } }} />
                        <GridToolbarFilterButton slotProps={{ button: { color: 'inherit' } }} />
                        <GridToolbarExport slotProps={{ button: { color: 'inherit' } }} />
                    </div>
                </div>
            </GridToolbarContainer>
        )
    }

    return (
        <Container style={{ height: 400, width: '110%', marginLeft: '-5%', }} >
            <DataGrid
                // rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 100]}
                density='standard'
                slots={{
                    toolbar: CustomToolbar,
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 5, page: 0 },
                    },
                }}
                className="dark:text-white dark:bg-blue-900 diplay: flex justify-center"
                onRowClick={handleRowClick}

            />
        </Container>
    );
}

export default CustomerGrid
