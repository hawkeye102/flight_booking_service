const {StatusCodes} =require('http-status-codes');
const {BookingService}=require('../services')
const {errorResponse, successResponse} =require('../utils/common')


async function createBooking(req,res) {
   
    try {
        console.log('Received request to update seats:', req.body);
        const response= await BookingService.createBooking({
            id:req.body.id,
            userId:req.body.userId,
            noofSeats : req.body.noofSeats
           
        });
        successResponse.data=response;
        return res.status(StatusCodes.OK).json( successResponse);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message || "Internal Server Error"
        });    
    }
    
}


module.exports ={
    createBooking
}