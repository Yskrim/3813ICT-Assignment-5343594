const express = require("express"); //express support
const { readJson, writeJson } = require("../utils"); //r/w methods

const router = express.Router(); // new router

// GROUPS

// GET /groups — all groups (superAdmin)
// GET /groups?userId=1 — only groups where the user is a member or an admin
router.get("/groups", async (req, res) => {
    const userId = (req.query.userId ?? "").trim();

    try {
        const groups = await readJson("groups.json");
        if (!userId) return res.json(groups);

        res.json(groups.filter((g) => g.memberIds.includes(userId) || g.adminIds.includes(userId)));
    } catch (err) {
        res.status(500).json({ error: "Storage error" });
    }
});

// GET one group by id
router.get("/groups/:id", async (req, res) => {
    try {
        const groups = await readJson("groups.json");
        const group = groups.find((g) => g.id === req.params.id);
        if (!group) return res.status(404).json({ error: "Not found" });
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: "Storage error" });
    }
});

// POST create a group
router.post("/groups", async (req, res) => {
    const { name, adminIds, memberIds } = req.body ?? {};
    const trimmedName = (name ?? "").trim();
    if (!trimmedName) return res.status(400).json({ error: "name is required" });

    try {
        const groups = await readJson("groups.json");

        // only whitelisted fields
        const newGroup = {
            id: String(Date.now()),
            name: trimmedName,
            adminIds: Array.isArray(adminIds) ? adminIds : [],
            memberIds: Array.isArray(memberIds) ? memberIds : [],
        };

        groups.push(newGroup);
        await writeJson("groups.json", groups);

        res.status(201).json(newGroup); // 201 == created, send the new group
    } catch (err) {
        res.status(500).json({ error: "Storage error" });
    }
});

module.exports = router; // export endpoint
