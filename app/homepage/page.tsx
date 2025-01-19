
import { ExtendedCustomerVehicle, getCustomerVehicles, isAdmin } from '@/lib/actions'
// import HomePage from './HomePage'
import { ClerkLoaded } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import CustomerVehicleGrid from './CustomerVehicleGrid'

const page = async() => {

  // Check if user is Admin
  const { isUserAdmin } = await isAdmin()

  // Gte the logged in user's clerk ID
  const { userId } = await auth()

  // Get all customer vehicles by dealership id
  const { vehicles, error } = await getCustomerVehicles(userId as string) as { vehicles: ExtendedCustomerVehicle[], error: string };

  return (
    <ClerkLoaded>
      <div className='container' suppressHydrationWarning>
        <CustomerVehicleGrid vehicles={vehicles ?? []} error={error ?? ''} isAdmin={isUserAdmin ?? false} />
        {/* <HomePage /> */}
      </div>
    </ClerkLoaded>
  )
}
export default page
