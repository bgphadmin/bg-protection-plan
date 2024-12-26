

import { checkUser } from "@/lib/checkUser";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import Homepage from "./Homepage";



const Guest = async () => {
  await checkUser();
  return (
    <div className="guest" style={{ zIndex: 1 }} >
      <SignedOut>
        <SignInButton>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/BG_logo4.png" alt="BG Logo" />
          </div>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="container">
            <Homepage />
        </div>
      </SignedIn>
    </div>
  )
}

export default Guest
