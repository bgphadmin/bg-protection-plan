import { PrismaClient } from '@prisma/client';
import  {User} from "./seeds/user";
import { db } from "../lib/db";
// const prisma = new PrismaClient();
// execute - npx prisma db seed in CLI


async function main() {
  await db.user.createMany({
    data: User,
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