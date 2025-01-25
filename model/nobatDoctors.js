import mongoose from "mongoose";
const nobatDoctorsSchema = new mongoose.Schema({
  doctorName: { type: String, trim: true },
  doctorId: { type: String },
  nobatDay: { type: Date },
  nobatType: { type: String },
  NobatInternet:{ type:Boolean,default:false,},
  nobatFrei: { type: Number },

  nobats: [
    {
      nobatTime: { type: String,trim: true,},
      reserve: Boolean,
      mobileSick: { type: String,trim: true,},
      codemilli: { type: String,trim: true,},
      TrackingCode: { type: String,trim: true,},
      FullName: { type: String,trim: true,},
      Hozor:  Boolean,
      Visit:  Boolean,
      Erja :  Boolean, 
      Pardakhti:{type: Number} ,
      Tozieh: { type: String,trim: true,},
    },
  ],
});



nobatDoctorsSchema.index({
  'nobats.mobileSick': "text",
  'nobats.codemilli': "text",
  'nobats.TrackingCode': "text",
  'nobats.FullName': "text"},
  {name:"nobatDoctorsrSerach"}
)

const insertNobat = async (
  doctorName,
  doctorId,
  nobatDay,
  nobats,
  nobatType,
  NobatInternet,
  nobatFrei
) => {
  //* create nested object
  const nobatRecored = {
    doctorName,
    doctorId,
    nobatDay,
    nobatType,
    NobatInternet,
    nobatFrei,
    nobats,
  };
  try {
    //* Assign nested object to the model
    const nobatJust = new nobatDoctors(nobatRecored);
    const doc = await nobatJust.save();
    return;
  } catch (error) {
    //return res.status(300).json({ message: "اشکال در انجام عملیات" });
    console.log(error);
  }
  // console.log(doc);
  // **********************
  //* {
  //moment().format('jYYYY/jM/jD')
  // const d='1402/09/22'
  // var m = moment(d, 'jYYYY/jM/jD') // Parse a Jalaali date
  // console.log("*********date test")
  // console.log(m.format('YYYY/M/D'));
  // console.log(m.format('jYYYY/jM/jD'));
  // console.log("****************");

  // console.log(m.format('jYYYY/jM/jD'))
  // m.add(2,'day');
  // console.log("********************")
  // console.log(m.format('YYYY/MM/DD'))
  // console.log(m.format('jYYYY/jMM/jDD'))
  // console.log("**********time *********")
  // const msSinceEpoch = ('19:30').getTime();
  // const seventeenHoursLater = new Date(msSinceEpoch + 10 * 60 * 1000);
  // console.log(seventeenHoursLater)
  // //* }
};

const nobatDoctors = mongoose.model("nobatDoctors", nobatDoctorsSchema);
export { nobatDoctors, insertNobat };
