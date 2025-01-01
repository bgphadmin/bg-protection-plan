'use server'

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Customer, User, Role, Dealership } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
// import { isAdmin } from "./utils";


export async function isAdmin (): Promise<{error?: string | null}> {

    const clerkUserId = (await auth()).userId

    if (!clerkUserId) {
        return { error: 'User not found' }
    }

    // Check if logged in user is Admin
    const user = await db.user.findUnique({
        where: {
            clerkUserId
        },
        select: {
            role: true
        }
    })

    if (user?.role !== 'Admin') {
        return { error: 'User not authorized' }
    }
    
    return {}
}


type GetCustomersResponse = {
    customers?: Customer[];
    error?: string;
    isAdmin?: boolean;
  };

/**
 * Retrieve all customers 
 * @returns {Promise<GetCustomersResponse>}
 */
export const getCustomersList = async (clerkId?: string): Promise<GetCustomersResponse> => {

    try {
        // Check if logged in user is Admin
        const user = await db.user.findUnique({
            where: {
                clerkUserId: clerkId
            },
            select: {
                role: true
            }
        })

        // if user is Main or Admin, get all customers without filtering
        if (user?.role === 'Admin') {
            const customers = await db.customer.findMany({
                // Added to include dealership name
                include: {
                    dealership: true
                },
                orderBy: {
                    createdAt:'desc'
                }
            })
            return {customers, isAdmin: true}        
        } else {
        // Get the user/contact person's dealership id and filter the customers list based on the dealership id
            const dealershipId = await db.user.findUnique({
                where: {
                    clerkUserId: clerkId
                },
                select: {
                    dealershipId: true
                }
            })
            const customers = await db.customer.findMany({
                where: {
                    dealershipId: dealershipId?.dealershipId
                },
                // Added to include dealership name
                include: {
                    dealership: true
                },
                orderBy: {
                    createdAt:'desc'
                }
            })
            return {customers, isAdmin: false}       
        }
    } catch (error) {
        return { error: 'Something went wrong while retrieving customer list. PLease try again. ' }  
    }
}

/** Add a new customer
 * @param formData 
 * @returns {Promise<{customer?: Customer, error?: string}>}
 */
export const addCustomer = async (formData: FormData): Promise<{customer?: Customer, error?: string}> => {

    try {

        // get the logged in user's clerk ID
        const {userId } =  await auth()

        if (!userId) {
            return {error: 'User not found'}    
        }
        
        console.log('userId: ', userId)

        // get the logged in user's dealership ID
        const dealership = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                dealershipId: true
            }
        })

        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const mobile = formData.get('mobile') as string;
        const landline = formData.get('landline') as string;
        const dealershipId = dealership?.dealershipId as number;

        if (!firstName || !lastName || !email || !mobile || !dealershipId) {
            return { error: 'Missing required fields' }
        }

        const customer = await db.customer.create({
            data: {
                fName: firstName,
                lName: lastName,
                email,
                mobile,
                landline,
                dealershipId,
                userId
            }
        })

        revalidatePath('/homepage/customers')

        return {customer}        
    } catch (error) {
        return { error: 'Something went wrong while adding customer' }
    }
}


/** Get all users
 * @returns {Promise<{users?: User[], error?: string}>}
 */
export const getUsersList = async (): Promise<{users?: User[], error?: string}> => {

    try {

        const {error} = await isAdmin()

        if (error) {
            return { error }
        }

        const users = await db.user.findMany({
            include: {
                dealership: true
            },
            orderBy: {
                createdAt:'desc'
            }
        })
        return {users}        
    } catch (error) {
        return { error: 'Something went wrong while retrieving user list. PLease try again. ' }  
    }
}


/** Get User by ID
 * @param id 
 * @returns {Promise<{user?: User, error?: string}>}
 */

export const getUserById = async (id: string): Promise<{user?: User, error?: string}> => {

    try {
        const user = await db.user.findUnique({
            where: {
                id
            },
            include: {
                dealership: true
            }
        })

        if (!user) {
            return { error: 'User not found' }
        }
        return {user}        
    } catch (error) {
        return { error: 'Something went wrong while getting user' }
    }   
}


/**get roles and dealsheips
 * @returns {Promise<{roles?: Role[], dealerships?: Dealership[], error?: string}>}
 */

export const getRolesAndDealerships = async (): Promise<{roles?: Role[], dealerships?: Dealership[], error?: string}> => {

    try {
        const roles = await db.role.findMany()
        const dealerships = await db.dealership.findMany()
        return {roles, dealerships}        
    } catch (error) {
        return { error: 'Something went wrong while getting roles and dealerships' }
    }

}

/**
 * Update user's role and dealership
 * @param id 
 * @param role 
 * @param dealership 
 * @returns {Promise<{user?: User, error?: string}>}
 */

export const updateRoleAndDealership = async (id: string, role: string, dealershipId: string): Promise<{user?: User, error?: string}> => {

    if (!id || !role || !dealershipId) {
        return { error: 'Missing required fields' }
    }

    try {
        const user = await db.user.update({
            where: {
                id
            },
            data: {
                role,
                dealershipId: parseInt(dealershipId)
            }
        })
        revalidatePath('/homepage/settings/setupContactPerson');
        
        return {user}        
    } catch (error) {
        return { error: 'Something went wrong while updating user' }
    }
}


/**
 * Get all dealerships
 * @returns {Promise<{dealerships?: Dealership[], error?: string}>}
 */

export const getDealershipsList = async (): Promise<{dealerships?: Dealership[], error?: string}> => {

    try {
        const {error} = await isAdmin()

        if (error) {
            return { error }
        }

        const dealerships = await db.dealership.findMany({
            orderBy: {
                name:'asc'
            }
        })
        return {dealerships}        
    } catch (error) {
        return { error: 'Something went wrong while retrieving dealership list. PLease try again. ' }  
    }
}

/** Add dealership
 * @param formData 
 * @returns {Promise<{dealership?: Dealership, error?: string}>}
 */

export const addDealership = async (formData: FormData): Promise<{dealership?: Dealership, error?: string}> => {

    try {

        const {error} = await isAdmin()

        if (error) {
            return { error }
        }

        const name = formData.get('name') as string;
        const address1 = formData.get('address1') as string;
        const address2 = formData.get('address2') as string;
        const mobile = formData.get('mobile') as string;
        const landline = formData.get('landline') as string;
        const contactPerson = formData.get('contactPerson') as string;

        if (!name || !address1 || !mobile) {
            return { error: 'Missing required fields' }
        }

    

        const dealership = await db.dealership.create({
            data: {
                name,
                address1,
                address2,
                mobile,
                landline,
                contactPerson
            }
        })

        revalidatePath('/homepage/settings/setupDealership')

        return {dealership}        
    } catch (error) {
         return { error: 'Something went wrong while adding dealership: ' + error }
    }
}

// // Get the clerk id for the logged in user
// export const getClerkIdLoggedIn = async (): Promise<{clerkId?: string, error?: string}> => {

//     try {
//         const {userId} =  await auth()

//         if (!userId) {
//             return {error: 'User not found'}
//         }
//         return {clerkId: userId}        
//     } catch (error) {
//         return { error: 'Something went wrong while getting clerk ID' }
//     }
// }


// type GetCustomersResponse = {
//     customers?: User[];
//     error?: string;
//   };

// /**
//  * Retrieve all customers 
//  * @returns {Promise<GetCustomersResponse>}
//  */
// export const getCustomers = async (): Promise<GetCustomersResponse> => {

//     try {
//         // add the total points for each customer or user

//         const customers = await db.user.findMany({
//             orderBy: {
//                 createdAt:'desc'
//             }
//         })
//         return {customers}        
//     } catch (error) {
//         return { error: 'Something went wrong while retrieving customer list. PLease try again. ' }  
//     }
// }


// export type IsClaimedResponse = {
//     isClaimedRef?: boolean;
//     error?: string;
// };    

// /**
//  * Check if reference ID has been claimed
//  * @param refId 
//  * @returns {boolean}
//  */
// export const isClaimed = async (refId: string): Promise<IsClaimedResponse> => {

//     try {
//         const ref = await db.reference.findUnique({
//             where: {
//                 refId
//             },
//             select: {
//                 claimed: true
//             }
//         })  
//         return {isClaimedRef: ref?.claimed}
//     } catch (error) {
//         return { error: 'Something went wrong while checking if Reference ID has been claimed' };
//     }
// }


// export type GetCustomersReFId = {
//     reference?: Reference[];
//     error?: string;
//   };
 
// /**
//  * Retrieve customer's Ref IDs
//  * @param userId 
//  * @returns {Promise<GetCustomersReFId>}
//  * 
//  */
// export const getCustomerRefIds = async (userId: string): Promise<GetCustomersReFId> => {
    
//     try {
//         const custRef = await db.reference.findMany({
//             where: {
//                 userId
//             },
//             orderBy: {
//                 createdAt:'desc'
//             },
    
//         })
//         return {reference: custRef}        
//     } catch (error) {
//         return { error: 'Something went wrong while getting Reference IDs' }  
//     }


// }           

// /**
//  * Get user's first name
//  * @param userId 
//  * @returns {Promise<{firstName?: string, error?: string}>}
//  * 
//  */
// export const getFirstName = async (userId: string): Promise<{firstName?: string, error?: string}> => {
    
//     try {
//         const user = await db.user.findUnique({
//             where: {
//                 clerkUserId: userId
//             },
//             select: {
//                 firstName: true
//             }
//         })
//         return {firstName: user?.firstName || undefined}    

//     } catch (error) {
//         return { error: 'Something went wrong while getting the first name' }  
//     }
    
// }



// type GetRefIdPoints = {
//     points?: Point[];
//     error?: string;
//   };

// /**
//  * Get points detailsfor a reference ID
//  * @param refId 
//  * @returns {Promise<GetRefIdPoints>}
//  */ 
// export const getRefIdPoints = async (refId: string): Promise<GetRefIdPoints> => {
    
//     try {
//         const points = await db.point.findMany({
//             where: {
//                 referenceId: refId
//             },
//             orderBy: {
//                 createdAt:'desc'
//             }
//         })
//         return {points}        
//     } catch (error) {
//         return { error: 'Something went wrong while getting your points' }
//     }

// }


// type GetClerkId = {
//     reference?: Reference[];
//     error?: string;
//     clerkId?: string;
//   };
 
// /**
//  * Get clerkId based on Reference ID
//  * @param refId 
//  * @returns {Promise<GetClerkId>}
//  */
// export const getClerkId = async (refId: string): Promise<GetClerkId> => {
    
//     try {
//         const ref = await db.reference.findUnique({
//             where: {
//                 refId
//             },
//             select: {
//                 userId: true
//             }
//         })  
//         return {clerkId: ref?.userId}        
//     } catch (error) {
//         return { error: 'Something went wrong while getting User ID' }
//     }
    

// }

// interface PointType {
//     comment?: string | null;
//     numWash: number;
//     numDry: number;
//     pointsDate: string;
//     freeWash: boolean;
// }


// interface TransactionResult {
//     data?: PointType;
//     error?: string;
// }  

// /**
//  * Add points to a reference ID
//  * @param formData 
//  * @param refId 
//  * @param clerkId
//  * @returns {Promise<TransactionResult>}
//  */
// export const addPoints = async ({formData, refId, clerkId}: {formData: FormData, refId: string, clerkId: string}): Promise<TransactionResult> => {

//     // Get logged in user
//     const {userId} =  await auth()

//     // Check for user
//     if (!userId) {
//         return { error: 'User not found' }
//     }

//     const freeWash = formData.get('isFreeWash') as string || undefined;
//     const comment = formData.get('comment') as string || undefined;
//     const numWash = formData.get('numWash') as string || undefined;
//     const numDry = formData.get('numDry') as string || undefined;
//     const pointsDate = formData.get('pointsDate') as string || undefined;
//     const points = parseInt(formData.get('numDry') as string) + parseInt(formData.get('numWash') as string);

//     if (!refId || !clerkId || !numWash || !numDry || !pointsDate) {
//         return { error: 'Missing required fields' }
//     }

//     if (points === 0 && freeWash === 'false') {
//         return { error: 'There should be 1 or more points added' }
//     }

//     if (points !== 0 && freeWash === 'on') {
//         return { error: 'There should not be any points added for free wash' }
//     }

//     try {
//         const pointsAdded: Point = await db.point.create({
//             data: {
//                 points,
//                 referenceId: refId,
//                 userId: clerkId,
//                 comment: comment ?? undefined ?? null ?? '',
//                 pointsDate,
//                 numWash: parseInt(numWash),
//                 numDry: parseInt(numDry),
//                 freeWash: freeWash === 'on' ? true : false
//             }
//         })

//         revalidatePath(`/customers/points/addPoints/${refId}`)

//         return {data: pointsAdded}        
    
//     } catch (error) {

//         return { error: 'Error adding points' }
    
//     }
// }


// type AddReference = {
//     reference?: Reference;
//     addRefError?: string;
//  };

//  /**
//  * Add reference details to the database
//  * @param clerkId 
//  * @returns {Promise<AddReference>}
//  */ 

// export const AddRefId = async (clerkId: string ): Promise<AddReference> => {
//     try {

//         const refId = await nanoid(8);

//         const ref = await db.reference.create({
//             data: {
//                 refId,
//                 userId: clerkId,
//             }
//         })
//         return {reference: ref}        
//     } catch (error) {
//         return { addRefError: 'Something went wrong while adding Reference ID' }
//     }
// }

// // Update claimed in Reference table to true
// export const updateClaimed = async (refId: string, claimedDate: string): Promise<{error?: string}> => {
//     try {
//         await db.reference.update({
//             where: {
//                 refId
//             },
//             data: {
//                 claimed: true,
//                 claimedDate
//             }
//         })
//         return {}
//     } catch (error) {
//         return { error: 'Something went wrong while updating Reference ID' }
//     }
// }


// export type PointResponse = {
//     pointDetails?: {
//         id: string;
//         comment?: string | null;
//         numWash: number;
//         numDry: number;
//         pointsDate: string;
//         freeWash: boolean;
//         referenceId: string;
//     };
//     error?: string;
// }

// /**
//  * Get points details for a point ID
//  * @param pointId 
//  * @returns {Promise<{point?: Point, error?: string}>}
//  */
// export const getPoint = async (pointId: string): Promise<PointResponse> => {
//     try {
//         const pointDetails = await db.point.findUnique({
//             where: {
//                 id: pointId
//             },
//             select: {
//                 id: true,
//                 comment: true,
//                 numWash: true,
//                 numDry: true,
//                 pointsDate: true,
//                 freeWash: true,
//                 referenceId: true
//             }
//         })
//         return {pointDetails: pointDetails!}
//     } catch (error) {
//         return { error: 'Something went wrong while getting point details' }
//     }
// }

// interface UpdatePointResponse {
//     pointDetails?: {
//         id: string;
//         createdAt: Date;
//         updatedAt: Date;
//         userId: string;
//         points: number;
//         pointsDate: string;
//         numWash: number;
//         numDry: number;
//         comment: string | null;
//         freeWash: boolean;
//         referenceId: string;
//     };
//     error?: string;
// }


// /**
//  * Update points details for a point ID
//  * @param pointId 
//  * @param formData 
//  * @returns {Promise<{point?: Point, error?: string}>}
//  */
// export const updatePoint = async (pointId: string, formData: FormData): Promise<UpdatePointResponse> => {
    
//     try {
//         const comment = formData.get('comment') as string || undefined;
//         const numWash = formData.get('numWash') as string || undefined;
//         const numDry = formData.get('numDry') as string || undefined;
//         const pointsDate = formData.get('pointsDate') as string || undefined;
//         const freeWash = formData.get('freeWash') as string || undefined;
//         const points = parseInt(formData.get('numDry') as string) + parseInt(formData.get('numWash') as string);

//         if (!pointId || !numWash || !numDry || !pointsDate) {
//             return { error: 'Missing required fields' }
//         }

//         if (points === 0) {
//             return { error: 'There should be at least 1 point added' }
//         }

//         const pointDetails = await db.point.update({
//             where: {
//                 id: pointId
//             },
//             data: {
//                 comment: comment ?? undefined ?? null ?? '',
//                 numWash: parseInt(numWash),
//                 numDry: parseInt(numDry),
//                 pointsDate,
//                 freeWash: freeWash === 'on' ? true : false,
//                 points
//             }
//         })        
//         return {pointDetails: pointDetails}
//     } catch (error) {
//         return { error: 'Something went wrong while updating point details' }
//     }
// }


// /**
//  * Delete points details for a point ID
//  * @param pointId 
//  * @returns {Promise<{point?: Point, error?: string}>}
//  */
// export const deletePoint = async (pointId: string): Promise<{error?: string}> => {
//     try {
//         await db.point.delete({
//             where: {
//                 id: pointId
//             }
//         })
//         return {}
//     } catch (error) {
//         return { error: 'Something went wrong while deleting point details' }
//     }
// }

// /**
//  * Get first name for a reference ID
//  * @param refId 
//  * @returns {Promise<{firstName?: string, error?: string}>}
//  */
// export const getFName = async (refId: string): Promise<{firstName?: string, error?: string}> => {
//     try {
//         const firstName = await db.reference.findUnique({
//             where: {
//                 refId
//             },
//             select: {
//                 userId: true
//             }
//         })

//         const user = await db.user.findUnique({
//             where: {
//                 clerkUserId: firstName!.userId
//             },
//             select: {
//                 firstName: true
//             }
//         })
//         return {firstName: user?.firstName ?? undefined}
//     } catch (error) {
//         return { error: 'Something went wrong while getting first name' }   
//     } 
// }

// /**
//  * Get the user's total points from the latest reference ID
//  * @returns {Promise<{points?: number, error?: string}>}
//  */
// export const getUserLatestRefPoints = async (): Promise<{points?: number, error?: string, refId?: string}> => {
//     try {
//         const {userId} =  await auth()

//         if (!userId) {
//             return {error: 'User not found'}
//         }

//         // Get latest reference ID
//         const reference = await db.reference.findFirst({
//             where: {
//                 userId
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             },
//             select: {
//                 refId: true
//             }
//         })

//         if (!reference) {
//             return {error: 'Reference ID not found'}
//         }
//         const refId = reference.refId

//         const points = await db.point.findMany({
//             where: {
//                 userId,
//                 referenceId: refId
//             },
//             orderBy: {
//                 pointsDate: 'desc'
//             },
//             select: {
//                 points: true
//             }
//         })
//         return {points: points.reduce((a, b) => a + b.points, 0)}
//     } catch (error) {
//         return { error: 'Something went wrong while getting points' }   
//     } 
// }


// /**
//  * Get the logged in user's latest reference ID and clerk ID
//  * @returns {Promise<{refId?: string, error?: string}>}
//  */
// export const getLatestRefId = async (): Promise<{refId?: string, clerkId?: string,  error?: string}> => {
//     try {
//         const {userId} =  await auth()

//         if (!userId) {
//             return {error: 'User not found'}
//         }

//         // Get the user's clerk ID
//         const clerkUserId = await db.user.findUnique({
//             where: {
//                 clerkUserId: userId
//             },
//             select: {
//                 clerkUserId: true
//             }
//         })

//         // Get latest reference ID
//         const reference = await db.reference.findFirst({
//             where: {
//                 userId
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             },
//             select: {
//                 refId: true
//             }
//         })

//         if (!reference) {
//             return {error: 'Reference ID not found'}
//         }
//         return {refId: reference.refId, clerkId: clerkUserId?.clerkUserId}
//     } catch (error) {
//         return { error: 'Something went wrong while getting reference ID' }
//     }   
// }

// /**
//  * Is user admin
//  * @returns {Promise<{isAdmin?: boolean, error?: string}>}
//  */
// export const isAdmin = async (): Promise<{isRoleAdmin?: boolean, error?: string}> => {
//     try {
//         const {userId} =  await auth()

//         const user = await db.user.findUnique({
//             where: {
//                 clerkUserId: userId || ''
//             },
//             select: {
//                 clerkUserId: true
//             }
//         })

//         return {
//             isRoleAdmin: 
//             user?.clerkUserId === process.env.ADMIN_CLERK_ID || 
//             user?.clerkUserId === process.env.ADMIN_CLERK_ID2 || 
//             user?.clerkUserId === process.env.ADMIN_CLERK_ID3 || 
//             user?.clerkUserId === process.env.ADMIN_CLERK_ID4 || 
//             user?.clerkUserId === process.env.ADMIN_CLERK_ID5 
//         }
//     } catch (error) {
//         return { error: 'Something went wrong while checking if user is admin' }
//     }
        
// }

// export type UserTotalPoints = {
//     totalPoints?: User & { totalPoints: number },
// }

// type GetCustomersResponseTotalPoints = {
//     customersTotalPoints?: UserTotalPoints [],
//     error?: string
// }

// /**
//  * Retrieve all customers with total points
//  * @returns {Promise<GetCustomersResponse>}
//  */
// export const getCustomersTotalPoints = async (): Promise<GetCustomersResponseTotalPoints> => {

//     try {
//         // Retrieve all customers
//         const customers = await db.user.findMany({
//             orderBy: {
//                 createdAt:'desc'
//             },
//             include: {
//                 referenceIds: {
//                     include: {
//                         pointIds: true
//                     }
//                 }
//             }
//         })

//         const customersTotalPoints = customers.map(customer => ({
//             totalPoints: {
//                 ...customer,
//                 totalPoints: customer.referenceIds.reduce((acc, reference) => {
//                     return acc + reference.pointIds.reduce((acc, point) => acc + point.points, 0)
//                 }, 0)
//             }
//         }))

//         return { customersTotalPoints }
//     } catch (error) {
//         return { error: 'Something went wrong while retrieving customer list. Please try again. ' }
//     }
// }



// interface PaymentData{
//     amount:           number;
//     email?:            string;
//     name?:              string;
//     phone?:             string;
//     currency:          string;
//     description?:       string;
//     fee:               number;
//     net_amount:        number;
//     payment_intent_id: string;
//     type:              string;
//     status:            string;
//     userId:            string;
// }

// interface PaymentResult {
//     data?: PaymentData;
//     error?: string;
// }

// async function createPayment ({paymentData}: {paymentData: PaymentData}): Promise<PaymentResult | null> {

//     try {
//         const payment = await db.payment.create({
//             data: {
//                 amount:           paymentData.amount/100,
//                 email:            paymentData.email,
//                 name:             paymentData.name,
//                 phone:            paymentData.phone,
//                 currency:         paymentData.currency,
//                 description:      paymentData.description,
//                 fee:              paymentData.fee/100,
//                 net_amount:       paymentData.net_amount/100,
//                 payment_intent_id:paymentData.payment_intent_id,
//                 type:             paymentData.type,
//                 status:           paymentData.status,
//                 userId:           paymentData.userId
//             }
//         })
//         return null
//     } catch (error) {
//         return { error: 'Something went wrong while creating payment: ' + error }      
//     }


// }

// export default createPayment