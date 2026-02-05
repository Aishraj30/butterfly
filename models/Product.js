import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true, // e.g. "Clothing"
    },

    subCategory: {
      type: String,
      required: true, // e.g. "Jacket"
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex"],
      required: true,
    },

    colors: [
      {
        type: String,
      },
    ],

    sizes: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    // ✅ MULTIPLE IMAGES
    images: [
      {
        type: String, // image URLs
        required: true,
      },
    ],

    imageGradient: {
      type: String,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
