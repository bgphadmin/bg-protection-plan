'use server'

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Customer, User, Dealership, CustomerVehicle, ProtectionPlan } from "@prisma/client";
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
                    dealership: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt:'desc'
                }
            })

            return {customers, isAdmin: true}        
        } else {
            // Get the user/contact person's dealership id
            const dealership = await db.user.findFirst ({
                where: {
                    clerkUserId: clerkId
                },
                select: {
                    dealershipId: true
                }
            })
            const { dealershipId } = dealership ?? { dealershipId: null };

            // get all customers based on dealership id
            const customers = await db.customer.findMany({
                where: {
                    dealershipId: dealershipId
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
        return { error: 'Something went wrong while retrieving customer list. Please try again. ' }  
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
        const dealershipId = dealership?.dealershipId as string;

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
            dealership: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return {users}        
    } catch (error) {
        return { error: 'Something went wrong while retrieving user list. PLease try again. ' }  
        // if (error instanceof Error) {
        //     return { error: error.message };
        // } else {
        //     return { error: 'An unknown error occurred' };
        // }
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
 * @returns {Promise<{dealerships?: Dealership[], error?: string}>}
 */

export const getRolesAndDealerships = async (): Promise<{dealerships?: Dealership[], error?: string}> => {

    try {
        const dealerships = await db.dealership.findMany()
        return {dealerships}        
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
                dealershipId: dealershipId
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
    dealershipId: string;
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

export const getDealershipById = async (id: string): Promise<{dealership?: Dealership, error?: string}> => {

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

export const updateDealership = async (id: string, name: string, address1: string, address2: string, mobile: string, landline: string, contactPerson: string): Promise<{dealership?: Dealership, error?: string}> => {

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


// declare module '@prisma/client' {
    export interface ExtendedCustomerVehicle extends CustomerVehicle {
        customer: {
            id: string;
            fName: string;
            lName: string;
        };
    }
// }


/** Get all customer vehicle by Customer's ID and User's dealership ID
 * @param contactPersonId
 * @param customerId
 * @returns {Promise<{vehicles?: ExtendedCustomerVehicle[], error?: string}>}
 */

export const getCustomerVehicles = async (contactPersonId: string, customerId?: string): Promise<{vehicles?: ExtendedCustomerVehicle[], error?: string}> => {
    
    try {

        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

        // Get dealershipId from the contact person's custIdDealershipId
        const dealershipId = await db.user.findFirst({
            where: {
                clerkUserId: contactPersonId
            },
            select: {
                dealershipId: true
            }
        })

        // return all vehicles if user is Admin
        const {isUserAdmin} = await isAdmin()

        if (isUserAdmin) {
            const vehicles = await db.customerVehicle.findMany({
                where: {
                    customerId
                },
                include: {
                    customer: true
                },
                orderBy: {
                    createdAt:'desc'
                }
            })
            return {vehicles}       
        }   

        // return all vehicles if customerId is not provided
        if (!customerId) {
            const vehicles = await db.customerVehicle.findMany({
                where: {
                    dealershipId: dealershipId?.dealershipId
                },
                include: {
                    customer: true
                },
                orderBy: {
                    createdAt:'desc'
                }
            })
            return {vehicles}       
        }

        // Get all vehicles owned by the customers based on the dealershipId
        const vehicles = await db.customerVehicle.findMany({
            where: {
                dealershipId: dealershipId?.dealershipId,
                customerId
            },
            include: {
                customer: true
            },
            orderBy: {
                createdAt:'desc'
            }
        })
        return {vehicles}        
    } catch (error) {
        return { error: 'Something went wrong while retrieving customer vehicles. PLease try again. ' }  
    }
}

/** Add a new vehicle
 * @param formData 
 * @returns {Promise<{vehicle?: CustomerVehicle, error?: string}>}
 */

export const addCustomerVehicle = async (formData: FormData, customerId: string): Promise<{vehicle?: CustomerVehicle, error?: string}> => {

    try {

        const enteredBy = (await auth()).userId
        if (!enteredBy) {
            return { error: 'User not found' }
        }

        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

        const make = formData.get('make') as string;
        const model = formData.get('model') as string;
        const year = parseInt(formData.get('year') as string, 10);
        const vin = formData.get('vin') as string;
        const plateNo = formData.get('plateNo') as string;
        const transmission = formData.get('transmission') as string;
        const fuelType = formData.get('fuelType') as string;


        const dealershipId = await db.user.findFirst({
            where: {
                clerkUserId: enteredBy
            },
            select: {
                dealershipId: true
            }
        })        


        if (!make || !model || !year || !vin || !plateNo || !transmission || !fuelType) {
            return { error: 'Missing required fields' }
        }

        const vehicle = await db.customerVehicle.create({
            data: {
                make,
                model,
                year,
                vin,
                plateNo,
                transmission,
                fuelEngineType: fuelType,
                enteredBy,
                customerId,
                dealershipId: dealershipId?.dealershipId
            }
        })
        return {vehicle}        
    } catch (error) {
        return { error: 'Something went wrong while adding new vehicle. PLease try again. ' }  
    }
}

// Get a vehicle by ID
export const getVehicleById = async (id: string): Promise<{vehicle?: ExtendedCustomerVehicle , error?: string}> => {

    try {
        const vehicle = await db.customerVehicle.findUnique({
            where: {
                id
            },
            include: {
                customer: true
            }
        })
        return { vehicle: vehicle ?? undefined }
    } catch (error) {
        return { error: 'Something went wrong while retrieving vehicle. PLease try again. ' }  
    }
} 

// Update customer vehicle by id
export const updateCustomerVehicle = async (formData: FormData, id: string): Promise<{error?: string} | undefined> => {

    try {

        const enteredBy = (await auth()).userId
        if (!enteredBy) {
            return { error: 'User not found' }
        }

        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

        const make = formData.get('make') as string;
        const model = formData.get('model') as string;
        const year = parseInt(formData.get('year') as string, 10);
        const vin = formData.get('vin') as string;
        const plateNo = formData.get('plateNo') as string;
        const transmission = formData.get('transmission') as string;
        const fuelType = formData.get('fuelType') as string;


        if (!make || !model || !year || !vin || !plateNo || !transmission || !fuelType) {
            return { error: 'Missing required fields' }
        }

        await db.customerVehicle.update({
            where: {
                id
            },
            data: {
                make,
                model,
                year,
                vin,
                plateNo,
                transmission,
                fuelEngineType: fuelType,
                enteredBy
            }
        })
    } catch (error) {
        return { error: 'Something went wrong while updating vehicle. PLease try again. ' }
    }
}


/** Get protection plan by customer vehicle id
 * @param id 
 * @returns {Promise<{plan?: ProtectionPlan, error?: string}>}
 */

export const getProtectionPlan = async (id: string): Promise<{plan?: ProtectionPlan[], error?: string}> => {

    try {

        // Admin, dealership and main can view protection plan
        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

        const plan = await db.protectionPlan.findMany({
            where: {
                customerVehicleId: id
            }
        })
        return { plan: plan ?? undefined }
    } catch (error) {
        return { error: 'Something went wrong while retrieving protection plan. PLease try again. ' }
    }
}

