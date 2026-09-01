const express = require("express"); //express support
const { readJson, writeJson } = require("../utils"); //r/w methods

const router = express.Router(); // new router

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

    const { password: _, ...authorisedUser } = user;
    res.json(authorisedUser);
    /* 
    // this works as here 

    // 1. object user is spread into properties
    // 2. object _ receives user's password. 
        
        // Password is cut out to prevent sharing.
        const _ = { user.password }; // another object, never returned/used.

        // same as: 
        const { ...authorisedUser } = user;
        delete authorisedUser.password;

    // 3. object authorisedUser receives everything else from user
    const authorisedUser = {
        id: user.id,
        username: user.username, 
        role: user.role,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        groupIds: user.groupIds,
        dateOfBirth: user.dateOfBirth, 
    };
    */
});

module.exports = router; // export endpoint
