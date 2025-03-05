
const axios = require('axios');
const {StatusCodes}= require('http-status-codes')
const {BookingRepository}=require('../repositories')
const db=require('../models')
const {serverconfig}=require('../config')
const Apperror = require('../utils/errors/app-error');
const { message } = require('../utils/common/error-response');

const bookingRepository= new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();  // Start transaction manually
    try {
        
            const flight = await axios.get(`${serverconfig.FLIGHT_SERVICE}/api/v1/flights/${data.id}`);
            const flightData = flight.data.data;

            if (data.noofSeats > flightData.totalSeats) {
                throw new Error('Required no of seats not available'); // Proper error handling
            }

            

            const totalBillingAmount=data.noofSeats * flightData.price;
            console.log(totalBillingAmount)
            const bookingPayload = {
                flightId: data.id,          // Ensure this is correct
                userId: data.userId,        // Ensure userId is provided
                noofSeats: data.noofSeats || 1,  // Default to 1 if missing
                totalCost: totalBillingAmount,   // Ensure totalCost is calculated
                status: "initiated",        // Default status (or use another valid status)
                createdAt: new Date(),      // Add timestamps explicitly
                updatedAt: new Date()
            };
            const booking= await bookingRepository .createBooking(bookingPayload,transaction);

      await axios.patch(`${serverconfig.FLIGHT_SERVICE}/api/v1/flights/${data.id}/seats`,{
                seats :data.noofSeats
            });

             await transaction.commit()  //for unmanaged transaction
            return booking;  // Successfully processed booking
    }
     catch (error) {

         await transaction.rollback(); //for unmanaged transaction
         console.error("Booking Error:", error.message || error);
        throw  error;
    }
}

   



module.exports={
    createBooking
}