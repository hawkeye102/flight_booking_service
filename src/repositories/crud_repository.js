const {StatusCodes} =require('http-status-codes')

const Apperror = require('../utils/errors/app-error');
// const logger = require('../utils/'); // Adjust the path if needed


class crudRepository{
    constructor(model){
        this.model=model;
    }



    async create(data) {
      
          const response = await this.model.create(data);
          return response;
      }
  
  



async destroy(data){
   
      const response= await this.model.destroy({
        where:{
            id:data
        }
      });
      if(!response){
        throw new Apperror("the plane is not found",StatusCodes.NOT_FOUND);
      }
      
      return response;
   
  }

  async get(data){
   
        const response = await this.model.findByPk(data); // Correct method name
  if(!response){
 
        throw new Apperror("the plane is not found",StatusCodes.NOT_FOUND);
}
      return response;
    } 
  

  async getAll(data){
   
      const response= await this.model.findAll();
      return response;
    } 
  


  async update(id,data){   // data-> { col:value} it ,must be an objects
   
      const response= await this.model.update(data,{
        where:{
         id:id
        }
      });
      return response;
    } 
      
    
}
  
module.exports=crudRepository;

