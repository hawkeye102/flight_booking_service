
const axios = require('axios');
const {StatusCodes}= require('http-status-codes')
const {BookingRepository}=require('../repositories')
const db=require('../models')
const {serverconfig}=require('../config')
const Apperror = require('../utils/errors/app-error');
const { message } = require('../utils/common/error-response');
const {Enums, errorResponse}=require('../utils/common')
const {BOOKED,CANCELLED} =Enums.BOOKING_STATUS;

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

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails= await bookingRepository.get(data.bookingId);
        if(bookingDetails.status == CANCELLED){
            throw new Apperror("The Booking has expired",StatusCodes.BAD_REQUEST); 
        }

        const bookingTime=new Date(bookingDetails.createdAt )
        const currentTime= new Date()

        if (currentTime - bookingTime > 300000) {
            await cancelBooking(data.bookingId);
            await transaction.commit();
            throw new Apperror("The Booking has expired", StatusCodes.BAD_REQUEST);
        }
        
        if(bookingDetails.totalCost != data.totalCost){
            throw new Apperror("the amount doesnt match",StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userId != data.userId){
            throw new Apperror("the user corresponding to booking doesnt match",StatusCodes.BAD_REQUEST);
        }
  // lets assume that we have made payment or it is successfully

  await bookingRepository.update(data.bookingId,{status :BOOKED},transaction);
  await transaction.commit()

    } catch (error) {
        await transaction.rollback(); //for unmanaged transaction
       throw  error; 
    }
}
  

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        console.log(bookingDetails);
        if(bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }
       
        await axios.patch(`${serverconfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noofSeats,
            dec: false
        });
        //console.log("Flight update response:");

        await bookingRepository.update(bookingId, {status: CANCELLED}, transaction);
       // console.log("Booking status updated to CANCELLED.");

        await transaction.commit();
       // console.log("Transaction committed successfully.");

    } catch(error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        console.log("Inside service")
        const time = new Date( Date.now() - 1000 * 300 ); // time 5 mins ago
        const response = await bookingRepository.cancelOldBookings(time);
        
        return response;
    } catch(error) {
        console.log(error);
    }

}


module.exports={
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings
    
}