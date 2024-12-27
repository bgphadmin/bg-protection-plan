import { getUsersList } from "@/lib/actions";
import UserGrid from "./UserGrid";
import { ClerkLoaded } from "@clerk/nextjs";


const SetupContactPersonPage = async () => {

    // Get all users from Users table
    const { users, error } = await getUsersList();

    return (
        <ClerkLoaded>
            <div className="container" suppressHydrationWarning>
                <UserGrid users={users} error={error} />
            </div>
        </ClerkLoaded>
    )
}

export default SetupContactPersonPage
