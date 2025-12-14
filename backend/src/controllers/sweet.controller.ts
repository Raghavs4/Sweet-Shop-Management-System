import type { Response } from "express"
import Sweet from "../models/Sweet.model"
import type { AuthRequest } from "../middleware/auth.middleware"

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, price, quantity, description, imageUrl } = req.body

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl,
    })

    await sweet.save()

    res.status(201).json({
      message: "Sweet created successfully",
      sweet,
    })
  } catch (error) {
    res.status(500).json({ message: "Error creating sweet", error })
  }
}

export const getAllSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 })
    res.json({ sweets })
  } catch (error) {
    res.status(500).json({ message: "Error fetching sweets", error })
  }
}

export const searchSweets = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query

    const query: any = {}

    if (name) {
      query.name = { $regex: name, $options: "i" }
    }

    if (category) {
      query.category = { $regex: category, $options: "i" }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 })
    res.json({ sweets })
  } catch (error) {
    res.status(500).json({ message: "Error searching sweets", error })
  }
}

export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, category, price, quantity, description, imageUrl } = req.body

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { name, category, price, quantity, description, imageUrl },
      { new: true, runValidators: true },
    )

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" })
    }

    res.json({
      message: "Sweet updated successfully",
      sweet,
    })
  } catch (error) {
    res.status(500).json({ message: "Error updating sweet", error })
  }
}

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const sweet = await Sweet.findByIdAndDelete(id)

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" })
    }

    res.json({ message: "Sweet deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting sweet", error })
  }
}

export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const sweet = await Sweet.findById(id)

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" })
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity in stock" })
    }

    sweet.quantity -= quantity
    await sweet.save()

    res.json({
      message: "Purchase successful",
      sweet,
    })
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase", error })
  }
}

export const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const sweet = await Sweet.findById(id)

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" })
    }

    sweet.quantity += quantity
    await sweet.save()

    res.json({
      message: "Restock successful",
      sweet,
    })
  } catch (error) {
    res.status(500).json({ message: "Error restocking sweet", error })
  }
}
