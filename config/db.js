const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/patients";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Mongo Successfully");
    } catch (error) {
        console.error("Failed to connect to Mongo:", error.message);
        process.exit(1); // Exit the process on failure
    }
};

module.exports = connectToMongo;