const cron =require('node-cron')
 
const {BookingService}=require('../../services/')

function scheduleCrons(){
    console.log('startedth cron jobs again ',BookingService)
    cron.schedule('*/30  * * * *', async () => {
     const response= await BookingService.cancelOldBookings()
     console.log(response)
  });
}

module.exports = scheduleCrons