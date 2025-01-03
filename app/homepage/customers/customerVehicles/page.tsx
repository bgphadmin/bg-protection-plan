import { getCustomerVehicles } from "@/lib/actions"
import { auth } from "@clerk/nextjs/server"
import CustomerVehicleGrid from "./CustomerVehicleGrid"


const CustomerVehiclesPage = async () => {

  const { userId } = await auth()

  const { vehicles, error } = await getCustomerVehicles(userId as string)

  return (
    <div className="container" suppressHydrationWarning>
      <CustomerVehicleGrid vehicles={vehicles ?? []} error={error ?? ''} />
    </div>
  )
}

export default CustomerVehiclesPage