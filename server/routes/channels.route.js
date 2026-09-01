const express = require("express"); //express support
const { readJson, writeJson } = require("../utils"); //r/w methods

const router = express.Router(); // new router

// CHANNELS

// all channels for user
router.get("/channels", async (req, res) => {
    const userId = req.query.userId;
    const groupId = req.query.groupId;

    const channels = await readJson("channels.json");
    let result = channels;

    // filter by group
    if(groupId) {
        result = channels.filter(c => c.groupId === groupId)
    }

    // filter by user
    if(userId) {
        const users = await readJson('users.json');
        const groups = await readJson('groups.json');

        // find the user
        const user = users.find(u => u.id === userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        // find user's groups
        const allowedGroupIds = new Set(user.groupIds); // set only adds unique values (duplicates ignored)
        for ( const group of groups) {
            if(group.memberIds.includes(userId)){
                allowedGroupIds.add(group.id);
            }
        }

        // filter channels by user's groups
        result = result.filter(c => allowedGroupIds.has(c.groupId))
    }
    // return filtered channels
    res.json(result);
});

// all channels for a user's group
router.get("/channels/:id", async (req, res) => {
    const channels = await readJson("channels.json");
    const channel = channels.find((c) => c.id === req.params.id);
    if (!channel) return res.status(404).json({ error: "Not found" });
    res.json(channel);
});


// create a channel (admin)
router.post("/channels", async (req, res) => {
    const channels = await readJson("channels.json");
    const newChannel = { id: String(Date.now()), ...req.body };
    channels.push(newChannel);
    await writeJson("channels.json", channels);
    res.status(201).json(newChannel);
});

module.exports = router; // export endpoint
