const express = require("express"); //express support
const { readJson, writeJson } = require("../utils"); //r/w methods

const router = express.Router(); // new router

// GROUPS

// all group
router.get("/groups", async (req, res) => {
    const groups = await readJson("groups.json");
    res.json(groups);
});

// all groups for user
router.get("/groups/:id", async (req, res) => {
    const groups = await readJson("groups.json");
    const group = groups.find((g) => g.id === req.params.id);
    if (!group) {
        return res.status(404).json({ error: "Not found" });
    }
    res.json(group);
});

// create group
router.post("/groups", async (req, res) => {
    const groups = await readJson("groups.json");
    const newGroup = { id: String(Date.now()), ...req.body };
    groups.push(newGroup);
    await writeJson("groups.json", groups);

    // send response, 201 == write success, send new group list
    res.status(201).json(newGroup);
});

module.exports = router; // export endpoint
