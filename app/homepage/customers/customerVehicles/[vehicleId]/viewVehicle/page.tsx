import { PageProps } from "@/.next/types/app/homepage/customers/customerVehicles/[vehicleId]/viewVehicle/page"
import AddVehicleForm from "./ViewVehicleForm"
import { getVehicleById } from "@/lib/actions"
import ViewVehicleForm from "./ViewVehicleForm"


interface ViewVehiclePageProps extends PageProps {
  params: Awaited<PageProps['params']>
}

const ViewVehiclePage = async ({ params }: { params: ViewVehiclePageProps['params'] }) => {

  const ViewVehiclePageParams = await params

  const vehicleId = await ViewVehiclePageParams.vehicleId

  // get vehicle by id
  const { vehicle, error } = await getVehicleById(vehicleId)

    return (
    <div className="container">
      <ViewVehicleForm vehicle={vehicle} error={error}  />
    </div>
  )
}

export default ViewVehiclePage
