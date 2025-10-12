const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const { listContacts, getContact, updateContact, deleteContact } = require("../controllers/contactAdminController");

router.get("/", auth, adminOnly, listContacts);
router.get("/:id", auth, adminOnly, getContact);
router.patch("/:id", auth, adminOnly, updateContact);
router.delete("/:id", auth, adminOnly, deleteContact);

module.exports = router;
