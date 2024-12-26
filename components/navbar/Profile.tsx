
import { SignedIn, UserButton } from "@clerk/nextjs"
import { checkUser } from "@/lib/checkUser";
import Spinner from "../Spinner";

const Profile = async () => {
    await checkUser();
    return (
        <div suppressHydrationWarning>
            <SignedIn>
                <UserButton fallback={<Spinner />} />
            </SignedIn>
        </div>
    )
}

export default Profile
