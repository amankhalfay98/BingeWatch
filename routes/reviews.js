const express = require("express");
const router = express.Router();
const data = require("../data");
const reviews = data.reviews;

router.get("/:id", async (req, res) => {});
router.post("/:id", async (req, res) => {});
router.delete("/:id", async (req, res) => {});

module.exports = router;
