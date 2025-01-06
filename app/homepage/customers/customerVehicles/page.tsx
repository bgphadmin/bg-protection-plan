import { PageProps } from "@/.next/types/app/homepage/customers/[id]/customerVehicles/page"
import { getCustomerVehicles } from "@/lib/actions"
import { auth } from "@clerk/nextjs/server"
import CustomerVehicleGrid from "./CustomerVehicleGrid"

interface CustomerVehiclesPageProps extends PageProps {
  params: Awaited<PageProps['params']>
}

const CustomerVehiclesPage = async ({ params }: CustomerVehiclesPageProps) => {

  const CustomerVehiclesPageParams = await params
  const customerId = await CustomerVehiclesPageParams.id

  // user id from user logged in
  const { userId } = await auth()

  const { vehicles, error } = await getCustomerVehicles(userId as string, customerId)

  return (
    <div className="container" suppressHydrationWarning>
      <CustomerVehicleGrid vehicles={vehicles ?? []} error={error ?? ''} customerId={customerId} />
    </div>
  )
}

export default CustomerVehiclesPage