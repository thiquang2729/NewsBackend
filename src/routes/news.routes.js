const express = require("express");
const { requireAuth } = require("../middleware/auth");
const newsController = require("../controllers/news.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", newsController.create);
router.get("/", newsController.list);
router.get("/:id", newsController.getById);
router.put("/:id", newsController.update);
router.delete("/:id", newsController.remove);

module.exports = router;
