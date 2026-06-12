import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
  throw new Error("Db url not found!");
}

let cached = global.mongooseConn;
if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    // console.log("cached conn return");
    return cached.conn;
  }

  if (!cached.promise) {
    // console.log("new connection");
    cached.promise = mongoose.connect(mongodbUrl).then((c) => c.connection);
  }

  try {
    const conn = await cached.promise;
    // console.log("MongoDB Connected");
    return cached.conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
