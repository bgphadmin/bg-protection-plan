import { PageProps } from "@/.next/types/app/homepage/customers/customerVehicles/viewVehicle/[id]/page"
import AddVehicleForm from "./ViewVehicleForm"
import { getVehicleById } from "@/lib/actions"
import ViewVehicleForm from "./ViewVehicleForm"


interface ViewVehiclePageProps extends PageProps {
  params: Awaited<PageProps['params']>
}

const ViewVehiclePage = async ({ params }: { params: ViewVehiclePageProps['params'] }) => {

  const ViewVehiclePageParams = await params

  const vehicleId = await ViewVehiclePageParams.id
  console.log('customerId: ', vehicleId)

  // get vehicle by id
  const { vehicle, error } = await getVehicleById(vehicleId)

    return (
    <div>
      <ViewVehicleForm vehicle={vehicle} error={error}  />
    </div>
  )
}

export default ViewVehiclePage
