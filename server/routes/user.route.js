// USERS
const express = require("express"); //express support
const { readJson, writeJson } = require("../utils"); //r/w methods

const router = express.Router(); // new router

// all users
router.get("/users", async (req, res) => {
    const users = await readJson("users.json");
    res.json(users);
});

// user by id
router.get("/users/:id", async (req, res) => {
    const users = await readJson("users.json");
    const user = users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
});

// delete user account
router.delete("/users/:id", async (req, res) => {
    const users = await readJson("users.json");
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    users.splice(index, 1);
    await writeJson("users.json", users);
    res.status(204).send();
});

// update user
router.put("/users/:id", async (req, res) => {
    
    const id = req.params.id // pull id from params, nt body.
    const updates = req.body;

    if (!id) return res.status(400).json({ error: "User id required" });

    const users = await readJson("users.json");
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    users[index] = { ...users[index], ...updates, id };
    await writeJson("users.json", users);

    const { password: _, ...safeUser } = users[index];
    res.json(safeUser);
});

module.exports = router; // export endpoint