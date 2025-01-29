const  express=require('express')

const router = express.Router();
const {infoControllers} =require('../../controllers')

router.get('/info',infoControllers.info)




module.exports=
router
