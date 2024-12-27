import { getUsersList } from "@/lib/actions";
import UserGrid from "./UserGrid";
import { toast } from "react-toastify";
import { ClerkLoaded } from "@clerk/nextjs";


const SetupContactPersonPage = async () => {

    //Steps to setup contact person from Users table
    // 1. Create a grid containg all the users from Users table  
    // 2. Select the user and update the role and dealership details

    // Get all users from Users table
    const { users, error } = await getUsersList();

    if (error) {
        console.log('Error: ', error);
    }

    console.log('Users: ', users);

    return (
        <ClerkLoaded>
            <div className="container" suppressHydrationWarning>
                <h1 className="text-2xl font-bold mt-4">APP USERS</h1>
                <UserGrid users={users} error={error} />
            </div>
        </ClerkLoaded>
    )
}

export default SetupContactPersonPage
