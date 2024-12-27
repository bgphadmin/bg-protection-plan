'use client'

import { ClerkLoaded } from "@clerk/nextjs";
import { Typography } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { User } from "@prisma/client"
import { redirect } from "next/navigation";
import { Container } from "@mui/material";
import { use, useEffect } from "react";
import { toast } from "react-toastify";
import { ImUsers } from "react-icons/im";
import HeaderTitle from "@/components/HeaderTitle";


const UserGrid = ({ users, error }: { users?: any, error?: string }) => {

    useEffect(() => {
        if (error) {
            toast.error(error);
            redirect('/homepage')
        }
    }, [error]);

    type RowForm = {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        role: "User" | "Dealership" | "Main" | "Admin";
        dealershipName?: string | null;
        createdAt: Date;
    }

    const rows = users?.map((user: { id: string; firstName: string | null; lastName: string | null; email: string; role: "User" | "Dealership" | "Main" | "Admin"; dealership?:{ name: string;}; createdAt: Date;} ) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        dealership: user.dealership?.name,
        dateRegistered: user.createdAt
    }));

    const columns = [
        { field: "firstName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'First Name'}</Typography>, },
        { field: "lastName", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Last Name'}</Typography>, },
        { field: "email", width: 250, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Email'}</Typography>, },
        { field: "role", width: 150, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Role'}</Typography>, },
        { field: "dealership", width: 250, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Dealership'}</Typography>, },
        { field: "dateRegistered", width: 200, renderHeader: () => <Typography sx={{ color: 'darkblue' }}>{'Date Registered'}</Typography>, },
    ];


    const handleRowClick = async (params: any) => {
        const id = await params.row.id;
        // add link to update user
        location.href = `/homepage/settings/setupContactPerson/${id}`
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
            <HeaderTitle Icon={ImUsers} title="Application Users" />
            <Container style={{ height: 400, width: '100%' }} >
                {/* TODO: Add bread crumbs here
                <BreadCrumbs /> */}
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

        </div>
    )
}

export default UserGrid
