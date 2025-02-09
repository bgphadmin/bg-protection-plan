import { PageProps } from "@/.next/types/app/homepage/customers/[id]/customerVehicles/page"
import { getCustomerVehicles } from "@/lib/actions"
import { auth } from "@clerk/nextjs/server"
import CustomerVehicleGrid from "./CustomerVehicleGrid"
import { db } from "@/lib/db"

interface CustomerVehiclesPageProps extends PageProps {
  params: Awaited<PageProps['params']>
}

const CustomerVehiclesPage = async ({ params }: CustomerVehiclesPageProps) => {

  const CustomerVehiclesPageParams = await params
  const customerId = await CustomerVehiclesPageParams.id

  // user id from user logged in
  const { userId } = await auth()

  const { vehicles, error } = await getCustomerVehicles(userId as string, customerId)

  // get first name and last name from customer id
  const customer = await db.customer.findUnique({ where: { id: customerId }, select: { fName: true, lName: true } })

  return (
    <div className="container" suppressHydrationWarning>
      <CustomerVehicleGrid vehicles={vehicles ?? []} error={error ?? ''} customerId={customerId} customer={customer ?? { fName: '', lName: '' }} />
    </div>
  )
}

export default CustomerVehiclesPage