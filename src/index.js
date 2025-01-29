const express=require('express');
const {serverconfig,logger} =require('./config');

const apiRouter=require('./routes')


const App=express();
App.use('/api',apiRouter)

App.listen(serverconfig.PORT,()=>{
    console.log(`the server is running on the port : ${serverconfig.PORT}`)
    logger.info("successfully started the server ", "root",{});
})