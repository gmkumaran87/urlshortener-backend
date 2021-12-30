const { MongoClient } = require("mongodb");

const dbConnection = async() => {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        console.log("Connected to the DB...!");
        return client;
    } catch (error) {
        console.log(error);
    }
};

module.exports = dbConnection;