import mongoose, { type Document, Schema } from "mongoose"

export interface ISweet extends Document {
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const sweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ISweet>("Sweet", sweetSchema)
