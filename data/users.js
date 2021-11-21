const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

module.exports = {
  //Functions Start here

async create(name, date_of_birth, username, password, email, watchlist, favourites,followers,following,reviewId,private,profile_pic,tag)
{
  //Error Handeling
  if (!name||!date_of_birth||!username||!password||!email) {
    throw 'One or more Input parameter missing. Please provide valid input for all fields for Restaurant.';
  }
  if (typeof name !== 'string' || name.trim().length === 0){
    throw 'User name is invalid'; 
  }
  if (typeof date_of_birth !== 'string' || date_of_birth.trim().length === 0){
    throw 'User Date of Birth is invalid'; 
  }
  if (typeof username !== 'string' || username.trim().length === 0){
    throw 'Username is invalid'; 
  }
  if (typeof email !== 'string' || email.trim().length === 0){
    throw 'User email id is invalid'; 
  }
  if (typeof password !== 'string' || password.trim().length === 0){
    throw 'Password is invalid'; 
  }
//     let restNumber = phoneNumber.split("-");
//     if(restNumber.length!==3||
//       restNumber[0].length!==3||
//       restNumber[1].length!==3||
//       restNumber[2].length!==4){
//     throw "Invalid Phone Number has been passed.";
//   }
    let emailId = email.split("@");
    if(!(emailId[emailId.length-1].localeCompare('com') === 0 )){
    throw "Please enter a valid Website For the Restaurant";
  }

//   if(!(priceRange.localeCompare('$') === 0 ||
//     priceRange.localeCompare('$$') === 0 || 
//     priceRange.localeCompare('$$$') === 0 || 
//     priceRange.localeCompare('$$$$') === 0)){
//     throw 'Price Range has to be between "$" and "$$$$" other input cannot be passed.';
//   }
//Arrays watchlist, favourites,followers,following,reviewId
  if(!Array.isArray(watchlist)){
    throw 'watchlist must be Array';
  }

  if(!Array.isArray(favourites)){
    throw 'favourites must be Array';
  }
  if(!Array.isArray(followers)){
    throw 'followers must be Array';
  }
  if(!Array.isArray(following)){
    throw 'following must be Array';
  }
  if(!Array.isArray(reviewId)){
    throw 'reviewId must be Array';
  }

//   for (let elements of cuisines) {
//     if(typeof elements !== 'string' || 
//       elements.trim().length === 0){
//         throw 'Cuisine have to be of type String.';
//     }
//   }

//   if(typeof serviceOptions !== 'object'|| 
//     Array.isArray(serviceOptions)){
//     throw 'Service Options has to be of type Object';
//   }
  
//   if(Object.keys(serviceOptions).length !== 3){
//     throw "Service Option missing."
//   }

//   for (const key in serviceOptions) {
//     if(!(key ==='dineIn')){
//       if(!(key ==='takeOut')){
//         if(!(key==='delivery')){
//       throw 'Service Options require dineIn, takeOut, delivery';
//         }
//       }
//     }
//     if(typeof private !== 'boolean'){
//        throw 'private can only be true or false';
//     }
//   }

  if(typeof private !== 'boolean'){
    throw 'private can only be true or false';
 }

  //Insert data into Database
    const collectionOfUsers = await users();

    let userDetails = {
        name: name,
        date_of_birth: date_of_birth,
        username: username, 
        password: password, 
        email: email, 
        watchlist: watchlist, 
        favourites: favourites,
        followers: followers,
        following: following,
        reviewId: reviewId,
        private: private,
        profile_pic: profile_pic,
        tag: tag
    };

    const userInserted = await collectionOfUsers.insertOne(userDetails);

    if (userInserted.insertedCount === 0) {
      throw 'User could not be added';
    }
    let userId = userInserted.insertedId;
    
    //convert ObjectID to String
    userId = userId.toString();

    const user = await this.get(userId);
    return user;
},

// async getAll(){
//   //Error Handeling
//   if(arguments.length!==0){
//     throw "Arguments cannot be passed for this function call.";
//   }
//   //Get list of data in DB
//     const collectionOfUsers = await users();
//     const listOfAllUsers = await collectionOfUsers.find({}).toArray();
//     //convert ObjectID to String
//     listOfAllUsers.forEach(user => {
//       let getIndex = user._id.toString();
//       user._id = getIndex;
//     });
//     return listOfAllUsers;
// },

async get(id){
 //Error Handeling
    if (!id) {
      throw 'Input Id field is required.';
    }
    
    if(typeof id !=='string'||id.trim().length===0){
      throw 'Id can only be of type String.';
    }

    //Converting String ID to ObjectID
    let objParseID = ObjectId(id);

    const collectionOfUsers = await users();
    const user = await collectionOfUsers.findOne({ _id: objParseID });
    if (!user) {
      throw 'User could not be found with the supplied ID.';
    }
    let getIndex = user._id.toString();
    user._id = getIndex;
    return user;
},

async remove(id){
  //Error Handeling
    if (!id){
      throw 'Input id must be provided.';
    } 
    if(typeof id !=='string'||id.trim().length===0){
      throw new 'Id can only be of type String.';
    }
    //Converting String ID to ObjectID
    let objParseID = ObjectId(id);
    //let delrest = await this.get(id);
    const collectionOfUsers = await users();
    //Delete Supplied Data ID object
    const userToBeDeleted = await collectionOfUsers.deleteOne({ _id: objParseID });

    if (userToBeDeleted.deletedCount === 0) {
      throw 'User with the supplied id could not be deleted/ does not Exist.';
    }

    let retObj ={};
    retObj['userId']= id,
    retObj['deleted'] = true
    return retObj;
},

async update (id, name, username, password, private, profile_pic){ //name, username, profile picture, password ,private
    
    // if (!id||!name||!username||!password||!website||!priceRange||!cuisines||!serviceOptions) {
    //     throw 'One or more Input parameter missing. Please provide valid input for all fields.';
    //   }
    if (!id){
        throw 'Input id must be provided.';
      } 
      if (typeof id !== 'string' || id.trim().length === 0){
        throw 'Please enter Valid (String) Name for Restaurant'; 
      }
    //   if (typeof name !== 'string' || name.trim().length === 0){
    //     throw 'Please enter Valid (String) Name for Restaurant'; 
    //   }
    //   if (typeof location !== 'string' || location.trim().length === 0){
    //     throw 'Please enter Valid (String) location for Restaurant'; 
    //   }
    //   if (typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0){
    //     throw 'Please enter Valid (String) phone number for Restaurant'; 
    //   }
    //   if (typeof website !== 'string' || website.trim().length === 0){
    //     throw 'Please enter Valid (String) website for Restaurant'; 
    //   }
    //   if (typeof priceRange !== 'string' || priceRange.trim().length === 0){
    //     throw 'Please enter Valid (String) price range for Restaurant'; 
    //   }
        let restNumber = phoneNumber.split("-");
      if(restNumber.length!==3||
          restNumber[0].length!==3||
          restNumber[1].length!==3||
          restNumber[2].length!==4){
        throw "Invalid Phone Number has been passed.";
      }
        let siteURL = website.split(".");
      if(!(siteURL[0].localeCompare('http://www') === 0) || 
         !(siteURL[siteURL.length-1].localeCompare('com') === 0 ) || 
         siteURL[1].length < 5){
        throw "Please enter a valid Website For the Restaurant";
      }
    
      if(!(priceRange.localeCompare('$') === 0 ||
        priceRange.localeCompare('$$') === 0 || 
        priceRange.localeCompare('$$$') === 0 || 
        priceRange.localeCompare('$$$$') === 0)){
        throw 'Price Range has to be between "$" and "$$$$" other input cannot be passed.';
      }
        
      if(!Array.isArray(cuisines)|| 
        cuisines.length === 0){
        throw 'Cuisines must be Array with atleast 1 cusine.';
      }
    
      for (let elements of cuisines) {
        if(typeof elements !== 'string' || 
          elements.trim().length === 0){
            throw 'Cuisine have to be of type String.';
        }
      }
    
      if(typeof serviceOptions !== 'object'|| 
        Array.isArray(serviceOptions)){
        throw 'Service Options has to be of type Object';
      }
    
      if(Object.keys(serviceOptions).length !== 3){
        throw "Service Option missing."
      }

      for (const key in serviceOptions) {
          if(!(key ==='dineIn')){
            if(!(key ==='takeOut')){
              if(!(key==='delivery')){
            throw 'Service Options require dineIn, takeOut, delivery';
              }
            }
          }
          if(typeof serviceOptions[key] !== 'boolean'){
           throw 'Service Options value have to be Boolean type.';
        }
      }

      const fieldValOfUser = await this.get(id);
      if(!fieldValOfUser) throw 'User does not exist.';
      //Update Data
    const collectionOfUsers = await users();
    const updateAllUser = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        website: website,
        priceRange: priceRange,
        cuisines: cuisines,
        serviceOptions: serviceOptions,
        overallRating: fieldValOfRest.overallRating,
        reviews: fieldValOfRest.reviews
    };
    let objParseID = ObjectId(id);
    const userDataUpdate = await collectionOfUsers.updateOne(
      { _id: objParseID },
      { $set: updateAllUser }
    );
    if (userDataUpdate.modifiedCount === 0) {
      throw 'User details could not be updated.';
    }
    return await this.get(id);  
}
};