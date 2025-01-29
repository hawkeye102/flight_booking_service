const dotenv=require('dotenv')

dotenv.config();
console.log('running')

module.exports= {
PORT: process.env.PORT,
}
