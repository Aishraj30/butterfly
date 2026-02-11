
import mongoose from "mongoose";

const MONGO_URI = "mongodb://eduwireinfo:TP6fseKwMQCTfwGH@ac-xuqp88u-shard-00-00.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-01.4t1nynz.mongodb.net:27017,ac-xuqp88u-shard-00-02.4t1nynz.mongodb.net:27017/butterfly?ssl=true&replicaSet=atlas-f9a3ay-shard-0&authSource=admin&retryWrites=true&w=majority";

async function checkProducts() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
            name: String,
            category: String,
            subCategory: String,
            isActive: Boolean
        }));

        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        if (products.length > 0) {
            console.log("Sample products categories:");
            products.slice(0, 5).forEach(p => {
                console.log(`- ${p.name}: Category="${p.category}", SubCategory="${p.subCategory}", IsActive=${p.isActive}`);
            });

            const categories = [...new Set(products.map(p => p.category))];
            console.log("Unique categories:", categories);
        }

        const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
            email: String,
            name: String
        }));

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkProducts();
