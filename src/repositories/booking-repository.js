const {StatusCodes} =require('http-status-codes');
const{Booking}=require('../models');
const CrudRepository =require('./crud_repository')

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking)
    }

    async createBooking(data,transaction){
        const response = await Booking.create(data,{transaction:transaction});
        return response;
    }

    async get(data,transaction){
   
        const response = await this.model.findByPk(data,{transaction:transaction}); // Correct method name
  if(!response){
 
        throw new Apperror("the plane is not found",StatusCodes.NOT_FOUND);
}
      return response;
    } 


    async update(id,data,transaction){   // data-> { col:value} it ,must be an objects
   
      const response= await this.model.update(data,{
        where:{
         id:id
        }
      },{transaction:transaction});
      return response;
    } 
      
  
}

module.exports=
    BookingRepository
