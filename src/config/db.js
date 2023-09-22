import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;



// import { MongoClient } from 'mongodb';

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGO_URI;
    
//     const client = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 50000, // Set a lower timeout value
//     });

//     await client.connect();

//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


