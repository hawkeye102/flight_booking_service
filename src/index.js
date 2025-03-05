const express=require('express');
const {serverconfig,logger} =require('./config');

const apiRouter=require('./routes')

const app=express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api',apiRouter)  



app.listen(serverconfig.PORT,()=>{
    console.log(`the server is running on the port : ${serverconfig.PORT}`)
    logger.info("successfully started the server ", "root",{});
})