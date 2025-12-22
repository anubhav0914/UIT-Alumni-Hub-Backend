import { prisma } from "./lib/prisma";

async function main() {
  console.log("Creating new user...");

  const user = await prisma.user.create({
    data: {
      full_name: "user6",
      email: "user6@example.com",
      phone: "9876543210",
      password_hash: "hashed_password_here",   // Replace with actual hash later
      is_verified: false,
    },
  });

  console.log("Created User:");
  console.log(user);

  console.log("\nFetching all users...");

  const users = await prisma.user.findMany({
    include: {
      primaryRole: true,
      roles: {
        include: {
          role: true,
        },
      },
      otp_codes: true,
      sessions: true,
      login_attempts: true, 
    },
  });

  console.log("\nAll Users:");
  // console.log(JSON.stringify(users, null, 2));
  console.log(
  JSON.stringify(
    users,
    (key, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  )
);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
