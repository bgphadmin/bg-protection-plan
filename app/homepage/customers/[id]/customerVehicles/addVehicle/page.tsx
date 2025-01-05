import { PageProps } from "@/.next/types/app/homepage/customers/[id]/customerVehicles/addVehicle/page"
import AddVehicleForm from "./AddVehicleForm"


interface AddVehiclePageProps extends PageProps {
  params: Awaited<PageProps['params']>
}

const AddVehiclePage = async ({ params }: { params: AddVehiclePageProps['params'] }) => {

  const AddVehiclePageParams = await params

  const customerId = await AddVehiclePageParams.id

  return (
    <div>
      <AddVehicleForm customerId={customerId} />
    </div>
  )
}

export default AddVehiclePage
