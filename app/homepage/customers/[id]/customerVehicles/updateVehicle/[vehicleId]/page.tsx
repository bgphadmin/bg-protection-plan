import { PageProps } from "@/.next/types/app/homepage/customers/[id]/customerVehicles/updateVehicle/[vehicleId]/page"
import { getVehicleById } from "@/lib/actions"
import UpdateVehicleForm from "./UpdateVehicleForm"


interface UpdateVehiclePageProps extends PageProps {
    params: Awaited<PageProps['params']>
}

const UpdateVehiclePage = async ({ params }: { params: UpdateVehiclePageProps['params'] }) => {
    
    const updateVehiclePageParams = await params

    const vehicleId = await updateVehiclePageParams.vehicleId

    // get vehicle by id
    const { vehicle, error } = await getVehicleById(vehicleId)

    return (
        <div className="container">
            <UpdateVehicleForm vehicle={vehicle ?? undefined} error={error} />
        </div>
    )
}

export default UpdateVehiclePage
