import mongoose from "mongoose";

const echosickSchema = new mongoose.Schema({
    sickcodemilli: String,
    fullnamesick: String,
    mobilesick: String,
    DoctorId: {type: mongoose.Schema.Types.ObjectId},
    DoctorFullname:String,
    DoctorMobileId:String,
    echolabData: mongoose.Schema.Types.Mixed, // برای ذخیره JSON به صورت کامل
    FinalResult:String,
    createDate: { type: Date, default: Date.now, },

});

echosickSchema.index({
    'fullnamesick' : "text",
    'sickcodemilli' : "text",
    'mobilesick'  : "text",
  },{name:"UserEchoSerach"}
  )


// Insert a new document
async function insertEchoSick(data) {
    try {
        const newEchoSick = new EchoSicks(data);
        const savedData = await newEchoSick.save();
        console.log('Inserted:', savedData);
        return savedData;
    } catch (error) {
        console.error('Insert Error:', error);
        throw error;
    }
}

// Update an existing document by ID
async function updateEchoSick(id, updatedData) {
    try {
        const updatedEchoSick = await EchoSicks.findByIdAndUpdate(id, updatedData, { new: true });
        console.log('Updated:', updatedEchoSick);
        return updatedEchoSick;
    } catch (error) {
        console.error('Update Error:', error);
        throw error;
    }
}

// Delete a document by ID
async function deleteEchoSick(id) {
    try {
        const deletedEchoSick = await EchoSicks.findByIdAndDelete(id);
        console.log('Deleted:', deletedEchoSick);
        return deletedEchoSick;
    } catch (error) {
        console.error('Delete Error:', error);
        throw error;
    }
}


const EchoSicks = mongoose.model("EchoSicks", echosickSchema);
export {EchoSicks, insertEchoSick, updateEchoSick, deleteEchoSick };

