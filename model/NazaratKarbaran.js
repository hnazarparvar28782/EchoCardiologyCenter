import mongoose from "mongoose";

const NazarKarBaranSchema = new mongoose.Schema({
   
    DoctorFullName: { type: String,trim: true,},
    DoctorId:  {type: String},
    KarbarFullName:{type:String},
    KarbarId:{ type:String}, 
    NazarKarbar:  {type: String},
    AprovNazar: {type: Boolean,default:false},
    SumStars:{type:Number,default:0},
    crateDate: { type: Date,default: Date.now,},
   
});

NazarKarBaranSchema.index({
  'DoctorFullName' : "text",
},
)


const insertNazar = async (DoctorFullName,DoctorId,KarbarFullName,KarbarId,NazarKarbar,SumStars) => {
  //* create NazarRecored of karbar
  const NazarRecored = {
    DoctorFullName,DoctorId,KarbarFullName,KarbarId,NazarKarbar,SumStars};
  try {
      //* Assign nested object to the model
      const Nazar =new NazarKarBaran(NazarRecored);
      const doc = await Nazar.save();
      console.log(doc)
      if (doc) {
        return doc
      } else {
        return null
      }  
      
  } catch (error) {
   console.log(error);
  }
  
};

const UpdateNazar = async (id,newInfo) => { 
  console.log("updating stste nazar>>>>>>>>>>>>")
  console.log(id,newInfo)
  console.log(newInfo)
  try { 
      const updatedResult  =  
         await NazarKarBaran.findByIdAndUpdate( 
          { _id: id }, 
          newInfo,
          { 
              new: true, 
              upsert: false, 
          } 
      ); 
     // console.log("result update in userupdate>>>>>>>>>>>>>")
      // console.log("updateing state is done!!!!!!!!!!!!!!!!!!!!!!"); 
     console.log(updatedResult)
  } catch (error) { 
      console.log("error update in userupdate>>>>>>>>>>>>>")
      console.log(error); 
  } 
}; 
const NazarKarBaran = mongoose.model("NazarKarBaran", NazarKarBaranSchema);
export { NazarKarBaran, insertNazar,UpdateNazar };
