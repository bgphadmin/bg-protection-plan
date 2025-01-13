'use client'

import { getProtectionPlansByCustomerVehicleId } from "@/lib/actions"
import { ClerkLoaded } from "@clerk/nextjs"
import { Container } from "@mui/material"
import { DataGrid, GridRowParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { ProtectionPlan } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const ProtectionPlanGrid = ({ vehicleId }: { vehicleId: string }) => {

  const [proctectionPlans, setProtectionPlans] = useState<ProtectionPlan[]>([]);

  useEffect(() => {
    // get protection plans by customer vehicle
    const getProtectionPlans = async () => {
      const { protectionPlans, error } = await getProtectionPlansByCustomerVehicleId(vehicleId);
      if (error) {
        toast.error(error);
        return;
      }
      setProtectionPlans(protectionPlans as ProtectionPlan[]);
    }

    getProtectionPlans();

  }, [vehicleId]);

  // create a mui x-grid for protection plans
  const rows = proctectionPlans.map((protectionPlan: ProtectionPlan) => ({
    id: protectionPlan.id,
    productUsed: protectionPlan.productUsed,
    invoice: protectionPlan.invoice,
    serviceDate: protectionPlan.serviceDate,
    odometerTo: protectionPlan.odometerTo,
    expired: protectionPlan.expired,
    expiryDate: protectionPlan.expiryDate,
    reimbursement: protectionPlan.reimbursement
  }));

  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
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
    // TODO: redirec(`/homepage/customers/${customerId}/customerVehicles/updateVehicle/${params.row.id}`);
  }

  return (
    <Container style={{ height: 400, width: '100%', marginTop: '2rem' }} >
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
  )
}

export default ProtectionPlanGrid
