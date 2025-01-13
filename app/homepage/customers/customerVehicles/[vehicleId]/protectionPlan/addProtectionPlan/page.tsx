import { PageProps } from "@/.next/types/app/homepage/customers/customerVehicles/[vehicleId]/protectionPlan/addProtectionPlan/page"
import AddProtectionPlanForm from "./AddProtectionPlanForm"

interface AddProtectionPlanPageProps extends PageProps {
  params: Awaited<PageProps['params']>
}

const AddProtectionPlanPage = async ({ params }: { params: AddProtectionPlanPageProps['params'] }) => {

    const AddProtectionPlanPageParams = await params

    const vehicleId = await AddProtectionPlanPageParams.vehicleId

    return (
    <div>
      <AddProtectionPlanForm vehicleId={vehicleId} />
    </div>
  )}

export default AddProtectionPlanPage
