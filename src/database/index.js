import mongoose from "mongoose";

const connectToDB = async () => {
    const connectionURL = process.env.MONGODB_URI;
    mongoose
    .connect(connectionURL)
    .then(() => { console.log("Connected to MongoDB Atlas");})
    .catch((error) => { console.error("Error connecting to MongoDB Atlas:", error.message); });
}
export default connectToDB;