const express = require("express");

const router = express.Router();

// import endpoints from routes directory
router.use(require("./routes/user.route"));
router.use(require("./routes/channels.route"));
router.use(require("./routes/groups.route"));
router.use(require("./routes/auth.route"));
router.use(require("./routes/admin-requests.route"));

module.exports = router;
