const  express=require('express')

const router = express.Router();
const {infoControllers} =require('../../controllers')

const bookingRoutes=require('./booking')

router.get('/info',infoControllers.info)

router.use('/booking',bookingRoutes)




module.exports=
router
