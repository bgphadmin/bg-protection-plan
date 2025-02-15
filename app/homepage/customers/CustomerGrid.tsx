'use client'

import React, { useEffect } from "react";
import { GridColDef, GridRowParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, } from "@mui/x-data-grid";
import { Button, Container, Typography } from "@mui/material";
import { toast } from "react-toastify";
import BreadCrumbs from "./BreadCrumbs";
import { ClerkLoaded } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IoCarSportSharp } from "react-icons/io5";
import { StripedDataGrid } from "@/lib/utils";

type RowForm = {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    dealershipName?: string | null;
    email: string;
    mobile: string;
    createdAt: Date;
}

const CustomerGrid = ({ customers, error }: { customers?: any, error?: string, isAdmin?: boolean }) => {

    useEffect(() => {
        if (error) {
            toast.error(error);
            redirect('/homepage')
        }
    }, [error]);


    const rows = customers?.map((customer: { id: string; fName: string; lName: string; dealership: { name: string; }; email: string; mobile: string; createdAt: Date; }): RowForm => ({
        id: customer?.id || "",
        firstName: customer?.fName,
        lastName: customer?.lName,
        dealershipName: customer?.dealership?.name,
        email: customer?.email,
        mobile: customer?.mobile,
        createdAt: customer?.createdAt
    }));

    const handleRowClick = (params: GridRowParams) => {
        redirect(`/homepage/customers/${params.id}`);
    }

    const handleAddVehicleClick = (params: GridRowParams) => {
        redirect(`/homepage/customers/${params.row.id}/customerVehicles`)
    }
    const columns: GridColDef[] = [
        {
            field: "Edit", width: 100,
            headerAlign: 'center',
            renderCell: (params: any) => {
                return (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            size="small"
                            variant="contained"
                            style={{ backgroundColor: "#FEE321", color: "black" }}
                            onClick={() => {
                                handleRowClick(params);
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                );
            },
        },
        {
            field: "Vehicle",
            width: 120,
            headerAlign: 'center',
            renderCell: (params: any) =>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button size="small"
                        variant="contained"
                        style={{ backgroundColor: "#FEE321", color: "black" }}
                        endIcon={<IoCarSportSharp size={22} />}
                        onClick={() => handleAddVehicleClick(params)}
                    >
                        +
                    </Button>
                </div>
        },
        { field: "firstName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'First Name'}</Typography>, },
        { field: "lastName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Last Name'}</Typography>, },
        { field: "dealershipName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Dealership'}</Typography>, },
        // { field: "email", width: 250, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Email'}</Typography>, },
        { field: "mobile", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Mobile'}</Typography>, },
        { field: "createdAt", width: 200, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Date Registered'}</Typography>, },
    ];


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
            />
        </Container>
    );
}

export default CustomerGrid
