import { PrismaClient } from '@prisma/client';
import  {User} from "./seeds/user";
import { db } from "../lib/db";
import { CustomerVehicles } from './seeds/customerVehicles';
// const prisma = new PrismaClient();
// execute - npx prisma db seed in CLI


async function main() {
  await db.user.createMany({
    data: User.map(user => ({ ...user, dealershipId: user.dealershipId?.toString() })),
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  })
  
  };

  main()