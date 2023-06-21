const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'PowerOfMotion',
      });
    console.log(`Mongo db connected ${conn.connection.host}`.cyan.underline.bold)
}
module.exports=connectDB