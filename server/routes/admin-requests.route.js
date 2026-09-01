const express = require("express"); //express support
const { readJson, writeJson } = require("../utils"); //r/w methods

const router = express.Router(); // new router

// GET /admin-requests
router.get("/admin-requests", async (req, res) => {
    const adminRequests = await readJson("admin-requests.json");
    res.json(adminRequests);
});

// GET /admin-requests/:id
router.get("/admin-requests/:id", async (req, res) => {
    const adminRequests = await readJson("admin-requests.json");
    const request = adminRequests.find((r) => r.id === req.params.id);
    if (!request) {
        return res.status(404).json({ error: "Not found" });
    }

    res.json(adminRequests);
});


// PUT /admin-requests/:id
// create group
router.post("/admin-requests/:id", async (req, res) => {
    const adminRequests = await readJson("admin-requests.json");
    const newRequestList = { id: String(Date.now()), ...req.body };
    groups.push(newRequestList);
    await writeJson("groups.json", groups);

    // send response, 201 == write success, send new group list
    res.status(201).json(newGroup);
});

// resolve request
router.put("/admin-requests/:id", async (req, res) => {
    // Get all adminRequests
    const adminRequests = await readJson("admin-requests.json");
    // Find the index of the request to update
    const idx = adminRequests.findIndex(r => r.id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ error: "Not found" });
    }
    // Update the request
    adminRequests[idx] = { ...adminRequests[idx], ...req.body, id: req.params.id };

    // Write updated requests back to file
    await writeJson("admin-requests.json", adminRequests);

    // Respond with the updated request
    res.json(adminRequests[idx]);
});

module.exports = router; // export endpoint
