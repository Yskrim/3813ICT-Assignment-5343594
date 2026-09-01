const express = require("express");
const { readJson, writeJson } = require("./utils");

const router = express.Router();

// AUTH
router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const users = await readJson("users.json");

    const user = users.find(
        (u) => u.username === username?.trim() && u.password === password,
    );

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
});

// GROUPS
router.get("/groups", async (req, res) => {
    const groups = await readJson("groups.json");
    res.json(groups);
});

router.get("/groups/:id", async (req, res) => {
    const groups = await readJson("groups.json");
    const group = groups.find((g) => g.id === req.params.id);
    if (!group) return res.status(404).json({ error: "Not found" });
    res.json(group);
});

router.post("/groups", async (req, res) => {
    const groups = await readJson("groups.json");
    const newGroup = { id: String(Date.now()), ...req.body };
    groups.push(newGroup);
    await writeJson("groups.json", groups);
    res.status(201).json(newGroup);
});

// CHANNELS
router.get("/channels", async (req, res) => {
    const channels = await readJson("channels.json");
    res.json(channels);
});

router.get("/channels/:id", async (req, res) => {
    const channels = await readJson("channels.json");
    const channel = channels.find((c) => c.id === req.params.id);
    if (!channel) return res.status(404).json({ error: "Not found" });
    res.json(channel);
});

router.post("/channels", async (req, res) => {
    const channels = await readJson("channels.json");
    const newChannel = { id: String(Date.now()), ...req.body };
    channels.push(newChannel);
    await writeJson("channels.json", channels);
    res.status(201).json(newChannel);
});

// USERS
router.get("/users", async (req, res) => {
    const users = await readJson("users.json");
    res.json(users);
});

router.get("/users/:id", async (req, res) => {
    const users = await readJson("users.json");
    const user = users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
});

router.put("/users", async (req, res) => {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ error: "User id required" });

    const users = await readJson("users.json");
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    users[index] = { ...users[index], ...updates, id };
    await writeJson("users.json", users);

    const { password: _, ...safeUser } = users[index];
    res.json(safeUser);
});

module.exports = router;
