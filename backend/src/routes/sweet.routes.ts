import express from "express"
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweet.controller"
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware"

const router = express.Router()

// Protected routes (require authentication)
router.post("/", authenticate, authorizeAdmin, createSweet)
router.get("/", authenticate, getAllSweets)
router.get("/search", authenticate, searchSweets)
router.put("/:id", authenticate, authorizeAdmin, updateSweet)
router.delete("/:id", authenticate, authorizeAdmin, deleteSweet)
router.post("/:id/purchase", authenticate, purchaseSweet)
router.post("/:id/restock", authenticate, authorizeAdmin, restockSweet)

export default router
