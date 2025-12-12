import express from "express";
import {UserRepository} from "./repositories/user.repository.js";

const app = express();
app.use(express.json());

const userRepo = new UserRepository();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running on localhost!");
});



BigInt.prototype.toJSON = function () {
  return this.toString();
};

// GET ALL USERS
app.get("/users", async (req, res) => {
  try {
    const users = await userRepo.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});


// START SERVER
const PORT = 3000; // you can change to any port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
