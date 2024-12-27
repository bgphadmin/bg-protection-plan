
import { SignedIn, UserButton } from "@clerk/nextjs"
import Spinner from "../Spinner";

const Profile = async () => {
    return (
        <div suppressHydrationWarning>
            <SignedIn>
                <UserButton fallback={<Spinner />} />
            </SignedIn>
        </div>
    )
}

export default Profile
