'use client'

import { ClerkLoaded } from "@clerk/nextjs";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { redirect } from "next/navigation";
import { Button, Container } from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { GiHomeGarage } from "react-icons/gi";
import HeaderTitle from "@/components/HeaderTitle";
import { Dealership } from "@prisma/client";
import Link from "next/link";
import BreadCrumbs from "./BreadCrumbs";
import { StripedDataGrid } from "@/lib/utils";
// import BreadCrumbs from "./BreadCrumbs";


const DealershiprGrid = ({ dealerships, error }: { dealerships?: Dealership[], error?: string }) => {

    useEffect(() => {
        if (error) {
            toast.error(error);
            redirect('/homepage')
        }
    }, [error]);

    const rows = dealerships?.map((dealership: Dealership) => ({
        id: dealership.id,
        name: dealership.name,
        address1: dealership.address1,
        address2: dealership.address2,
        mobile: dealership.mobile,
        landline: dealership.landline,
        contactPerson: dealership.contactPerson,
    }));

    const columns = [
        // { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 225 },
        { field: 'address1', headerName: 'Address 1', width: 225 },
        { field: 'address2', headerName: 'Address 2', width: 130 },
        { field: 'mobile', headerName: 'Mobile', width: 130 },
        { field: 'landline', headerName: 'Landline', width: 130 },
        { field: 'contactPerson', headerName: 'Contact Person', width: 130 },
    ];


    const handleRowClick = async (params: any) => {
        const id = await params.row.id;

        // add link to update dealership
        location.href = `/homepage/settings/setupDealership/${id}`
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
                    <HeaderTitle Icon={GiHomeGarage} title="Dealerships" />
                    <Button variant="contained" size="medium" className="text-white mb-2">
                        <Link href={`/homepage/settings/setupDealership/addDealership`} className="flex items-center text-white">
                            <GiHomeGarage className="mr-2" />
                            ADD
                        </Link>
                    </Button>
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
                    onRowClick={handleRowClick}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                />
            </Container>

        </div>
    )
}

export default DealershiprGrid
