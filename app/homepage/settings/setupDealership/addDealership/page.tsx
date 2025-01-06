'use client'

import { ClerkLoaded } from "@clerk/nextjs"
import AddDealershipForm from "./AddDealershipForm"

const SetupDealershipPage = () => {
  return (
    <div className="container">
      <AddDealershipForm />
    </div>
  )
}

export default SetupDealershipPage
