'use server'

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Customer, User, Role, Dealership } from "@prisma/client";
import { revalidatePath } from "next/cache";


export async function isAdmin (): Promise<{isUserAdmin?: boolean,  error?: string | null}> {

    try {
        const clerkUserId = (await auth()).userId

        if (!clerkUserId) {
            return { error : 'User not found' }
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
        
        return {isUserAdmin: true}        
    } catch (error) {
        return { error: 'Something went wrong while checking if user is Admin' }
    }
}


// function to check if user role is Admin or Main or Dealership
export async function isAdminMainDealership (): Promise<{isUserAdminMainDealership?: boolean,  error?: string | null}> {
    const clerkUserId = (await auth()).userId

    if (!clerkUserId) {
        return { error: 'User not found' }
    }

    // Get the user's role
    const user = await db.user.findUnique({
        where: {
            clerkUserId
        },
        select: {
            role: true
        }
    })

    // if role is not Main, Dealer or Admin, return error
    if ((user?.role !== 'Main' && user?.role !== 'Dealership' && user?.role !== 'Admin')) {
        return { error: 'User not authorized' }
    }
    
    return {isUserAdminMainDealership: true}
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

        // if role is not Main, Dealer or Admin, return error
        // if (user?.role !
        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

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
        
        // get the logged in user's dealership ID
        const dealership = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                dealershipId: true,
                role: true
            }
        })

        // if role is not Main, Dealer or Admin, return error
        if (!((dealership?.role === 'Main') || (dealership?.role === 'Dealership') || (dealership?.role === 'Admin'))) {
            return { error: 'User not authorized' }
        }


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

export interface CustomerDealership {
    id: string;
    fName: string;
    lName: string;
    email?: string;
    mobile: string;
    landline?: string | null;
    dealershipId: number;
    dealership: Dealership; // add this property
  }


/** Get Customer by ID 
 * @param id
 * @returns {Promise<{customer?: CustomerDealership, error?: string}>}
*/

export const getCustomerById = async (id: string): Promise<{customer?: CustomerDealership, error?: string}> => {

    try {
        const customer = await db.customer.findUnique({
            where: {
                id
            },
            include: {
                dealership: true
            }
        })

        if (!customer) {
            return { error: 'Customer not found' }
        }
        return {customer: customer as CustomerDealership }        
    } catch (error) {
        return { error: 'Something went wrong while getting customer' }
    }   
}


/** Update Customer 
 * @param id
 * @param fName
 * @param lName
 * @param email
 * @param mobile
 * @param landline
 * @returns {Promise<{customer?: Customer, error?: string}>}
 * */

export const updateCustomer = async (id: string, fName: string, lName: string, email: string, mobile: string, landline: string): Promise<{customer?: Customer, error?: string}> => {

    if (!id || !fName || !lName || !email || !mobile ) {
        return { error: 'Missing required fields' }
    }

    try {
        const customer = await db.customer.update({
            where: {
                id
            },
            data: {
                fName,
                lName,
                email,
                mobile,
                landline,
            }
        })
        revalidatePath('/homepage/customers');
        
        return {customer}        
    } catch (error) {
        return { error: 'Something went wrong while updating customer' }
    }
}

/** Get dealership by ID
 * @param id
 */

export const getDealershipById = async (id: number): Promise<{dealership?: Dealership, error?: string}> => {

    try {
        const dealership = await db.dealership.findUnique({
            where: {
                id
            }
        })

        if (!dealership) {
            return { error: 'Dealership not found' }
        }
        return {dealership}        
    } catch (error) {
        return { error: 'Something went wrong while getting dealership' }
    }
}

/** Update dealership details 
 * @param id
 * @param name
 * @param address1
 * @param address2
 * @param mobile
 * @param landline
 * @param contactPerson
 * @returns {Promise<{dealership?: Dealership, error?: string}>}
 * */

export const updateDealership = async (id: number, name: string, address1: string, address2: string, mobile: string, landline: string, contactPerson: string): Promise<{dealership?: Dealership, error?: string}> => {

    if (!id || !name || !address1 || !mobile ) {
        return { error: 'Missing required fields' }
    }

    try {
        const {error} = await isAdmin()

        if (error) {
            return { error }
        }

        const dealership = await db.dealership.update({
            where: {
                id
            },
            data: {
                name,
                address1,
                address2,
                mobile,
                landline,
                contactPerson
            }
        })
        revalidatePath('/homepage/settings/setupDealership');
        
        return {dealership}        
    } catch (error) {
        return { error: 'Something went wrong while updating dealership' }
    }
}