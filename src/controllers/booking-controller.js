const {StatusCodes} =require('http-status-codes');
const {BookingService}=require('../services')
const {errorResponse, successResponse} =require('../utils/common')

const inMemdb={}


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

async function makePayment(req,res) {

   
    try {
        const idempotencyKey=req.headers['x-idempotency-key']

        if(!idempotencyKey){
            return res.status(error.statusCode || StatusCodes.BAD_REQUEST)
            .json({
               message :'idempotency key is missing'
            }); 
        }

        if( inMemdb[idempotencyKey]){
            return res.status(error.statusCode || StatusCodes.BAD_REQUEST)
            .json({
               message :'cannot retry on a sucessfull payment'
            });   

        }
        console.log('Received request to update seats:', req.body);
        const response= await BookingService.makePayment({
            totalCost:req.body. totalCost,
            userId:req.body.userId,
            bookingId :req.body.bookingId

           
        });
        inMemdb[idempotencyKey]=idempotencyKey
        successResponse.data=response;
        return res.status(StatusCodes.OK).json( successResponse);
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message || "Internal Server Error"
        });    
    }
    
}


module.exports ={
    createBooking,
    makePayment
}