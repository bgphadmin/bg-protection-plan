import { currentUser, auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"


export const checkUser = async () => {
    // Check for current logged in clerk user
    const user = await currentUser()

    if (!user) {
        return null
    }

    // Check if user is in the neon database
    const loggedInUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id
        }
    })

    // If user is in the neon database, return the user
    if (loggedInUser) {
        return loggedInUser
    }

    // If user is not in the neon database, create a new user
    const newUser = await db.user.create({
        data: {
            clerkUserId: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            imageUrl: user.imageUrl,
            isAdmin: false
        }
    })

    return newUser
}