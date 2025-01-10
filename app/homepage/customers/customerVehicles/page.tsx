import { getCustomerVehicles, isAdmin } from "@/lib/actions"
import { auth } from "@clerk/nextjs/server"
import CustomerVehicleGrid from "./CustomerVehicleGrid"

const CustomerVehiclesPage = async () => {

  const { isUserAdmin } = await isAdmin()

  // user id from user logged in
  const { userId } = await auth()

  // const { vehicles, error } = await getCustomerVehicles(userId as string, customerId)
  const { vehicles, error } = await getCustomerVehicles(userId as string, undefined)

  return (
    <div className="container" suppressHydrationWarning>
      <CustomerVehicleGrid vehicles={vehicles ?? []} error={error ?? ''} isAdmin={isUserAdmin ?? false}  />
    </div>
  )
}

export default CustomerVehiclesPage