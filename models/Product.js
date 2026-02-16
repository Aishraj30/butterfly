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
      type: String, // e.g. "Clothing"
    },

    collectionName: {
      type: String, // e.g. "Summer 2026"
    },

    subCategory: {
      type: String, // e.g. "Jacket"
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

    stock: {
      type: Number,
      default: 0,
    },

    description: { type: String },
    fabricComposition: { type: String }, // "100% Polyester/Cosmic Sequin"
    fit: { type: String }, // "Fitted"
    closure: { type: String }, // "Back Zipper"
    sleeveType: { type: String }, // "Sleeveless"
    washCare: { type: String }, // "Dry Clean Only..."
    countryOfManufacture: { type: String }, // "India"
    modelSize: { type: String }, // "XS"
    modelHeight: { type: String }, // "5'9"
    shippingTime: { type: String }, // "Within 10-12 Weeks..."

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent Mongoose OverwriteModelError but allow schema updates in development
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model("Product", productSchema);
