
import HomePage from './HomePage'
import { ClerkLoaded } from '@clerk/nextjs'

const page = () => {
  return (
    <ClerkLoaded>
      <div className='container' suppressHydrationWarning>
        <HomePage />
      </div>
    </ClerkLoaded>
  )
}
export default page
