
import { SignedIn, UserButton } from "@clerk/nextjs"
import { checkUser } from "@/lib/checkUser";

const Profile = async () => {
    await checkUser();
    return (
        <div>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
}

export default Profile
