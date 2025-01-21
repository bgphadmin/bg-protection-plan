'use server'

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Customer, User, Dealership, CustomerVehicle, ProtectionPlan } from "@prisma/client";
import { revalidatePath } from "next/cache";
import products from "@/data/products.json";
import moment from 'moment';
// import Error from "next/error";

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
        dealerships?: {
            name?: string;
        }
    }


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
                    customer: true,
                    dealerships: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt:'desc'
                }
            }) as ExtendedCustomerVehicle[]

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
export const getVehicleById = async (id: string): Promise<{vehicle?: ExtendedCustomerVehicle , error?: string | undefined}> => {

    try {

        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

        const vehicle = await db.customerVehicle.findUnique({
            where: {
                id
            },
            include: {
                customer: true,
                dealerships: {
                    select: {
                        name: true
                    },
                }
            }
        }) as ExtendedCustomerVehicle
        return {vehicle}

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

/** Add new protection plan
 * @param formData 
 * @returns {Promise<{plan?: ProtectionPlan, error?: string}>}
 */

// export const addProtectionPlan = async (formData: FormData, customerVehicleId: string): Promise<{plan?: ProtectionPlan, error?: string}> => {
export const addProtectionPlan = async (formData: FormData, customerVehicleId: string): Promise<{error?: string}> => {

    try {
        
        const {error} = await isAdminMainDealership()
        if (error) {
            return { error }
        }

        // Entered by
        const enteredBy = (await auth()).userId
        if (!enteredBy) {
            return { error: 'User not found' }
        }

        // get dealership id
        const dealership = await db.customerVehicle.findUnique({
            where: {
                id: customerVehicleId
            },
            select: {
                dealershipId: true,
                customerId: true
            }
        })

        // Make isApprovedOil a boolean
        let approvedOil = false
        const isApprovedOil = formData.get('isApprovedOil') as string;
        if (!isApprovedOil) {
            approvedOil = false
        } else {
            approvedOil = true
        }
        
        const productUsed = formData.get('productUsed') as string;
        const invoice = formData.get('invoice') as string;
        const serviceDate = formData.get('serviceDate') as string;
        const odometerFrom = parseInt(formData.get('odometer') as string);

        // convert serviceDate to ISO-8601
        const isoServiceDate = moment(serviceDate).toISOString();

        // get covers from productsUsed
        const covers = products.find((product) => product.name === productUsed)?.covers

        if (!covers) {
            return { error: 'Coverage not found' }
        }


        // This is where all the logic will happen
        // FOR REIMUBURSMENT
        // get the service type from the product used
        let reimbursement = "$0.00"
        const serviceType = products.find((product) => product.name === productUsed)?.serviceType

        if (serviceType === "Engine Oil Plus Service - MOA" && odometerFrom <= 80000) {
            reimbursement = "$6,000.00";
        } else if (serviceType === "Engine Oil Plus Service - MOA" && (odometerFrom > 80000 && odometerFrom <= 160000)) {
            reimbursement = "$3,000.00"
        } else if (serviceType === "Performance Oil Service - MOA" && odometerFrom <= 80000) {
            reimbursement = "$6,000.00"
        } else if (serviceType === "Performance Oil Service - MOA" && (odometerFrom > 80000 && odometerFrom <= 160000)) {
            reimbursement = "$3,000.00"
        } else if (odometerFrom <= 80000) {
            reimbursement = "$4,000.00"
        } else if (odometerFrom > 80000 && odometerFrom <= 160000) {
            reimbursement = "$2,000.00"
        } else {
            reimbursement = "$0.00"    
        }

        // get the odometerTo

        // convert service date to a date format and add 1 year to get expiry date
        const date = new Date(serviceDate);
        let expiryDate = date.toLocaleDateString('en-US')
        if (serviceType === "Cooling System Service" || serviceType === "Power Steering Service" || serviceType === "Drive Line Service" || serviceType === "Brake Service") {
            const dateIn2Years = new Date(date.getTime() + (365 * 2 * 24 * 60 * 60 * 1000));
            // expiryDate = dateIn2Years.toLocaleDateString('en-US') //.toISOString().split('T')[0];
            expiryDate = moment(dateIn2Years).toISOString()
        } else {
            const dateIn1Year = new Date(date.getTime() + (365 * 24 * 60 * 60 * 1000));
            // expiryDate = dateIn1Year.toLocaleDateString('en-US') //.toISOString().split('T')[0];
            expiryDate = moment(dateIn1Year).toISOString()
        }

        // get the service intreval based on products and if it is approved oil
        // as well as the odometerTo
        let odometerTo = 0
        let serviceInterval = ""
        if ((approvedOil && (productUsed === "BG110" || productUsed === "BG112" || productUsed === "BG110/BG213" || productUsed === "BG110/BG208" || productUsed === "BG110/BG213/BG407" || productUsed === "BG110/BG208/BG407")) || (!approvedOil && productUsed === "BG109/BG110") || (! approvedOil && productUsed === "BG109/BG112") || productUsed === "BG115" || (!approvedOil && (productUsed ==="BG115/BG213" || productUsed ==="BG115/BG213/BG407" )) || (!approvedOil && (productUsed === "BG115/BG208" || productUsed === "BG115/BG208/BG407" ))) {
            serviceInterval = "Coverage will be continued by the performance of the BG Service within 10,000 miles/16,000 km of the previous service or 12 months, whichever comes first. From the date of the Protection Plan enrollment, the vehicle’s engine must be serviced only with the proper grade and weight of engine oil, recommended by the vehicle manufacturer. Timing belt and air and oil filter must be replaced and emission control system maintained in accordance with vehicle manufacturer’s recommendations.";
            odometerTo = 16000 + odometerFrom;
        } else if ((!approvedOil && (productUsed === "BG110" || productUsed === "BG112" || productUsed === "BG110/BG213" || productUsed === "BG110/BG208" || productUsed === "BG110/BG213/BG407" || productUsed === "BG110/BG208/BG407")) || (!approvedOil && (productUsed === "BG109/BG110/BG208" || productUsed === "BG109/BG110/BG208/BG407" )) || (!approvedOil && (productUsed === "BG109/BG112/BG244" || productUsed === "BG109/BG112/BG244/BG407")) || (!approvedOil && (productUsed === "BG109/BG112/BG245" || productUsed === "BG109/BG112/BG245/BG407" ))) {
            serviceInterval = "Coverage will be continued by the performance of the BG Service within 7,500 miles/12,000 km of the previous service or 12 months, whichever comes first. From the date of the Protection Plan enrollment, the vehicle’s engine must be serviced only with the proper grade and weight of engine oil, recommended by the vehicle manufacturer. Timing belt and air and oil filter must be replaced and emission control system maintained in accordance with vehicle manufacturer’s recommendations.";
            odometerTo = 12000 + odometerFrom;
        } else if ((approvedOil && (productUsed === "BG109/BG110" || productUsed === "BG109/BG112" || productUsed === "BG109/BG112/BG244" || productUsed === "BG109/BG112/BG244/BG407" || productUsed === "BG109/BG112/BG245" || productUsed === "BG109/BG112/BG245/BG407") || productUsed === "BG109/BG110/BG208" || productUsed === "BG109/BG110/BG208/BG407") || (!approvedOil && productUsed === "BG115/BG109") || (!approvedOil && (productUsed === "BG115/BG109/BG208" || productUsed === "BG115/BG109/BG208/BG407" ))) {
            serviceInterval = "Coverage will be continued by the performance of the BG Service within 12,500 miles/20,000 km or 12 months, whichever comes firs.t From the date of the Protection Plan enrollment, the vehicles engine must be serviced only with the proper grade and weight of engine oil, recommended by the vehicle manufacturer. Timing belt and air and oil filter must be replaced and emission control system maintained in accordance with vehicle manufacturer’s recommendations.";
            odometerTo = 20000 + odometerFrom;
        } else if (approvedOil && (productUsed === "BG115/BG109/BG208" || productUsed === "BG115/BG109/BG208/BG407")) {
            serviceInterval = "Coverage will be continued by the performance of the BG Service within 15,000 miles/25,000 km if BG 729, BG 737 or OEM approved oil is used or 12 months, whichever comes firs.t From the date of Protection Plan enrollment, the vehicle’s engine must be serviced only with the proper grade and weight of engine oil, recommended by the vehicle manufacturer. The timing belt and air and oil filter must be replaced and emission control system maintained in accordance with the vehicle manufacturer’s recommendations.";
            odometerTo = 25000 + odometerFrom;
        } else if (!approvedOil && (productUsed === "BG208/BG206/BG211" || productUsed === "BG208/BG206/BG210" || productUsed === "BG208/BG206/BG206" || productUsed === "BG201/BG260/BG208" || productUsed === "BG260" || productUsed === "BG260/BG208"   || productUsed === "BG208/BG206/BG211/BG407" || productUsed === "BG208/BG206/BG210/BG407" || productUsed === "BG208/BG206/BG206/BG407" || productUsed === "BG201/BG260/BG208/BG407" || productUsed === "BG260/BG407" || productUsed === "BG260/BG208/BG407"   )) {
            serviceInterval = "Coverage will be continued by the performance of the proper BG Service within 15,000 miles/25,000 km of the previous service or 12 months, whichever comes first";
            odometerTo = 25000 + odometerFrom;
        } else if (!approvedOil && productUsed === "BG540/BG546") {
            serviceInterval = "Coverage will be continued by the performance of a BG Cooling System Service within 30,000 miles/50,000 km of the previous service or 24 months, whichever comes first."
        } else if (!approvedOil && (productUsed === "BG108/BG332" || productUsed === "BG108/BG334")) {
            serviceInterval = "Coverage will be continued by the performance of a BG Power Steering Service within 30,000 miles/50,000 km of the previous service or 24 months, whichever comes first.";
            odometerTo = 50000 + odometerFrom;
        } else if (!approvedOil && (productUsed === "BG750/BG751/BG752" || productUsed === "BG750/BG751/BG753" || productUsed === "BG750/BG751" || productUsed === "BG750/BG792") ) {
            serviceInterval = "Coverage will be continued by the performance of a BG Drive Line Service within 30,000 miles/50,000 km of the previous service or 24 months, whichever comes first."
            odometerTo = 50000 + odometerFrom;
        } else if (!approvedOil && productUsed === "BG-Brake-Fluid") {
            serviceInterval = "Coverage will be continued by the performance of a BG Brake Service within 30,000 miles/50,000 km of the previous service or 24 months, whichever comes first."
            odometerTo = 50000 + odometerFrom;
        } else {
            serviceInterval = "Service Interval not found";
            return { error: 'Service Interval not found' }
        }


        // GET CUSTOMER ID by Vehicle ID
        const customer = await db.customerVehicle.findUnique({
            where: {
                id: customerVehicleId
            },
            select: {
                customerId: true
            }
        })

        // GET DEALERSHIP ID by VEHICLE ID
        const dealershipId = await db.customerVehicle.findUnique({
            where: {
                id: customerVehicleId
            },
            select: {
                dealershipId: true
            }
        })

        if (!productUsed || !invoice || !serviceDate || !odometerFrom) {
            return { error: 'Missing required fields' }
        }

        if (!dealership?.dealershipId) {
            return { error: 'Dealership ID is required' }
        }

        await db.protectionPlan.create({
            data: {
                productUsed,
                invoice,
                serviceDate: isoServiceDate,
                odometerFrom,
                odometerTo,
                enteredBy,
                customerVehicleId,
                covers,
                dealershipId: dealership.dealershipId,
                customerId: dealership?.customerId,
                approvedOil,
                reimbursement,
                expiryDate,
                expired: false,
                serviceInterval,
                updatedAt: new Date(),
                createdAt: new Date()
            } 
        })

        revalidatePath(`/homepage/customers/customerVehicles/${customerVehicleId}/viewVehicle`);

        return { error: undefined };
    } catch (error: Error | any) {
        return { error: 'Something went wrong while adding new protection plan. PLease try again. ' }   
    }
}


interface GetProtectionPlanResponse {
    protectionPlans?: ProtectionPlan[];
    error?: string;
}
/**
 * Get all protection plans by customer vehicle ID
 * @param customerVehicleId 
 * @returns {Promise<GetProtectionPlanResponse>}
 */

export const getProtectionPlansByCustomerVehicleId = async (customerVehicleId: string): Promise<GetProtectionPlanResponse> => {

    try {
        // get all protection plans by customer vehicle
        const protectionPlans = await db.protectionPlan.findMany(
            {
                where: {
                    customerVehicleId
                },
                orderBy: {
                    createdAt: 'desc'
                },
            }
        )

        return { protectionPlans };
    } catch (error) {
        return { error: 'Something went wrong while getting protection plans' }
    }
    
}


export interface ExtendedProtectionPlan extends ProtectionPlan {
    customer: {
        fName: string;
        lName: string;
    };
    dealerships?: {
        name?: string;
    };
    customerVehicle: {
        make: string;
        model: string | null;
        plateNo: string;
    };
}



/** Get protection plan by logged in user
 * @returns {Promise<{plans?: ExtendedProtectionPlan[], error?: string}>}
 */
export const getProtectionPlanList = async (): Promise<{plans?: ExtendedProtectionPlan[], error?: string}> => {
    // Get protection plan list with customer customer vehicle make and model and dealership name
    try {

        // get logged in user
        const user = await auth();
        
        if (!user) {
            return { error: 'User not found' }
        }

        // Check is user is Admin
        const {isUserAdmin} = await isAdmin();

        if (isUserAdmin) {
           const plans = await db.protectionPlan.findMany({
                include: {
                    customerVehicle: {
                        select: {
                            make: true,
                            model: true,
                            plateNo: true
                        }
                    },
                    dealership: {
                        select: {
                            name: true
                        }
                    },
                    customer: {
                        select: {
                            fName: true,
                            lName: true,
                        }
                    }
                },
                orderBy: {
                    expiryDate: 'asc',
                },
            })
            return { plans };
        } else {

            // get dealership id by logged in user
            const dealershipId = await db.user.findUnique({
                where: {
                    clerkUserId: user?.userId || ''
                },
                select: {
                    dealershipId: true
                }
            })

            const plans = await db.protectionPlan.findMany({
                where: {
                    dealershipId: dealershipId?.dealershipId as string
                },
                include: {
                    customerVehicle: {
                        select: {
                            make: true,
                            model: true,
                            plateNo: true
                        }
                    },
                    dealership: {
                        select: {
                            name: true
                        }
                    },
                    customer: {
                        select: {
                            fName: true,
                            lName: true,
                        }
                    }
                },
                orderBy: {
                    expiryDate: 'asc',
                },
            })
    
            return { plans };
        }

    } catch (error) {
        return { error: 'Something went wrong while getting protection plans' }
    }

 }
 