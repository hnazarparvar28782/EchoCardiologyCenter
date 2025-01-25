const collapseIdentify = () => {
  const collapseIdentifyIcon = document.getElementById("collapseIdentifyIcon");
  if (collapseIdentifyIcon.classList.contains("fa-plus")) {
    collapseIdentifyIcon.classList.remove("fa-plus");
    collapseIdentifyIcon.classList.add("fa-minus");
    divdoctorIdentify = document.getElementById("divdoctorIdentify");
    divdoctorIdentify.style.display = "block";
  } else {
    collapseIdentifyIcon.classList.remove("fa-minus");
    collapseIdentifyIcon.classList.add("fa-plus");
    divdoctorIdentify = document.getElementById("divdoctorIdentify");
    divdoctorIdentify.style.display = "none";
  }
  return;
};
const collapseBiographi = () => {
  const collapseBiographiIcon = document.getElementById(
    "collapseBiographiIcon"
  );
  if (collapseBiographiIcon.classList.contains("fa-plus")) {
    collapseBiographiIcon.classList.remove("fa-plus");
    collapseBiographiIcon.classList.add("fa-minus");
    divBiographi = document.getElementById("divBiographi");
    divBiographi.style.display = "block";
  } else {
    collapseBiographiIcon.classList.remove("fa-minus");
    collapseBiographiIcon.classList.add("fa-plus");
    divBiographi = document.getElementById("divBiographi");
    divBiographi.style.display = "none";
  }
  return;
};
const collapseDiableDays = () => {
  const collapseDiableDaysIcon = document.getElementById(
    "collapseDiableDaysIcon"
  );
  if (collapseDiableDaysIcon.classList.contains("fa-plus")) {
    collapseDiableDaysIcon.classList.remove("fa-plus");
    collapseDiableDaysIcon.classList.add("fa-minus");
    divDiableDays = document.getElementById("divDiableDays");
    divDiableDays.style.display = "block";
    SayOldConfDisableDays()
  } else {
    collapseDiableDaysIcon.classList.remove("fa-minus");
    collapseDiableDaysIcon.classList.add("fa-plus");
    divDiableDays = document.getElementById("divDiableDays");
    divDiableDays.style.display = "none";
  }
  return;
};
const collapseLaws = () => {
  const colapseLawIcon = document.getElementById("colapseLawIcon");
  if (colapseLawIcon.classList.contains("fa-plus")) {
    colapseLawIcon.classList.remove("fa-plus");
    colapseLawIcon.classList.add("fa-minus");
    divlowSection = document.getElementById("divlowSection");
    divlowSection.style.display = "block";
  } else {
    colapseLawIcon.classList.remove("fa-minus");
    colapseLawIcon.classList.add("fa-plus");
    divlowSection = document.getElementById("divlowSection");
    divlowSection.style.display = "none";
    s;
  }
  return;
};

const collapsechangepass = () => {
  const changePasswordIcon = document.getElementById("changePasswordIcon");
  if (changePasswordIcon.classList.contains("fa-plus")) {
    changePasswordIcon.classList.remove("fa-plus");
    changePasswordIcon.classList.add("fa-minus");
    divChangePassword = document.getElementById("divChangePassword");
    divChangePassword.style.display = "block";
  } else {
    changePasswordIcon.classList.remove("fa-minus");
    changePasswordIcon.classList.add("fa-plus");
    divChangePassword = document.getElementById("divChangePassword");
    divChangePassword.style.display = "none";
  }

  return;
};
const collapseUpload = () => {
  const collapseUploadIcon = document.getElementById("collapseUploadIcon");
  const sendStatus = document.getElementById("sendStatus")
  const uploadfiledoctor = document.getElementById("uploadfiledoctor");
  if (collapseUploadIcon.classList.contains("fa-plus")) {
    collapseUploadIcon.classList.remove("fa-plus");
    collapseUploadIcon.classList.add("fa-minus");
    divupload = document.getElementById("divupload");
    divupload.style.display = "block";
    sendStatus.innerHTML="";
    uploadfiledoctor.value="";
  } else {
    collapseUploadIcon.classList.remove("fa-minus");
    collapseUploadIcon.classList.add("fa-plus");
    divupload = document.getElementById("divupload");
    divupload.style.display = "none";
  }
  return;
};
const collapseUploadpic = () => {
  const collapseUploadpicIcon = document.getElementById(
    "collapseUploadpicIcon"
  );
  if (collapseUploadpicIcon.classList.contains("fa-plus")) {
    collapseUploadpicIcon.classList.remove("fa-plus");
    collapseUploadpicIcon.classList.add("fa-minus");
    divuploadpic = document.getElementById("divuploadpic");
    divuploadpic.style.display = "block";
  } else {
    collapseUploadpicIcon.classList.remove("fa-minus");
    collapseUploadpicIcon.classList.add("fa-plus");
    divuploadpic = document.getElementById("divuploadpic");
    divuploadpic.style.display = "none";
  }
  return;
};
const collapsePrepic = () => {
  const collapsePrepicIcon = document.getElementById("collapsePrepicIcon");
  if (collapsePrepicIcon.classList.contains("fa-plus")) {
    collapsePrepicIcon.classList.remove("fa-plus");
    collapsePrepicIcon.classList.add("fa-minus");
    divupPrepic = document.getElementById("divPrepic");
    divPrepic.style.display = "block";
  } else {
    collapsePrepicIcon.classList.remove("fa-minus");
    collapsePrepicIcon.classList.add("fa-plus");
    divuPrepic = document.getElementById("divPrepic");
    divPrepic.style.display = "none";
  }
  return;
};
const collapseSelctPlane = () => {
  const selctPlanIcon = document.getElementById("selctPlanIcon");
  if (selctPlanIcon.classList.contains("fa-plus")) {
    selctPlanIcon.classList.remove("fa-plus");
    selctPlanIcon.classList.add("fa-minus");
    divSelectPlane = document.getElementById("divSelectPlane");
    divSelectPlane.style.display = "block";
  } else {
    selctPlanIcon.classList.remove("fa-minus");
    selctPlanIcon.classList.add("fa-plus");
    divSelectPlane = document.getElementById("divSelectPlane");
    divSelectPlane.style.display = "none";
  }
  return;
};

const subIdentifyDoctors = () => {};
const  SayOldConfDisableDays =()=>{
  var DisableDaysVar= DisableDays;
  if (DisableDaysVar!=" ") 
    DisableDaysVar = DisableDaysVar.split(",").map(Number);
  DisableDaysVar.forEach(NumDay => {
    document.getElementById(`IdDay${NumDay}`).checked=true;
  });
}
const setPricM = () => {
  const pricm = document.getElementById("pricm");
  const variz = document.getElementById("variz");
  variz.value = pricm.value;
};
const setPricY = () => {
  const pricm = document.getElementById("priceyear");
  const variz = document.getElementById("variz");
  variz.value = pricm.value;

};
const setPricFM = () => {
  const pricm = document.getElementById("pricefullmonats");
  const variz = document.getElementById("variz");
  variz.value = pricm.value;
};
const setPricFY = () => {
  const pricm = document.getElementById("pricefullyear");
  const variz = document.getElementById("variz");
  variz.value = pricm.value;
};
const setPricR = () => {
  const pricm = document.getElementById("priceFree");
  const variz = document.getElementById("variz");
  variz.value = pricm.value;
};

//* displaySelectedImage in the  placeholder
//* elemebtId is the palceholder
//***************************** */
function displaySelectedImage(event, elementId) {
  const selectedImage = document.getElementById(elementId);
  const fileInput = event.target;
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    selectedImage.style="display:block"
    reader.onload = function (e) {
      selectedImage.src = e.target.result;
    };

    reader.readAsDataURL(fileInput.files[0]);
  }
}

const uploadMadarek = async()=> {
  let xhttp = new XMLHttpRequest(); //create Ajax request
  const sendStatus = document.getElementById("sendStatus");
  const uploadfiledoctor = document.getElementById("uploadfiledoctor");
  const progressBar=document.getElementById("progressBar");
  const progressDiv=document.getElementById("progressDiv");
  
  
  xhttp.responseType = "json";
  xhttp.onreadystatechange = function () {
    if (xhttp.status==200){
      sendStatus.innerHTML = this.response.message;
      uploadfiledoctor.value="";
      sendStatus.classList.remove("text-danger");
      sendStatus.classList.add("text-success");
    } else {
      if (this.response.done=="false") {
        sendStatus.classList.remove("text-success");
        sendStatus.classList.add("text-danger");
      }
      sendStatus.innerHTML=this.response.message;
     
    }
      
  };

  xhttp.open("POST", "/dashboard/image-upload");
    
  
  
  xhttp.upload.onprogress = function (e) {
    if(e.lengthComputable){
      let result= Math.floor((e.loaded/e.total)*100)
      console.log(result);
      if (result!==100){
        progressBar.innerHTML = result + "%";
        progressBar.style="width:" + result + "%";
      } else {
         progressDiv.style="display:none";
      }
      
    }
  }
  

   
let formData = new FormData();

  if (uploadfiledoctor.files.length>0){
      progressDiv.style="display:block"
      formData.append("uploadfiledoctor", uploadfiledoctor.files[0]);
      sendStatus.innerHTML="this is a test"
      formData.append("infodata", sendStatus.innerText);
      xhttp.send(formData);
    
  } else {
    sendStatus.innerHTML="برای آپلود عکس حتما باید فایلی انتخاب شود!"
  }

};

const  saveEditSelectPlan = async()=>{
 //*create httprequest As Ajax reqeste
  let xhttp = new XMLHttpRequest();
  xhttp.responseType = "json";
  
  const panelSelected=document.querySelector('input[name="PlanSelected"]:checked').value;

  const varizMab=document.getElementById("variz").value
  const transactMab=document.getElementById("transact").value
  const data={panelSelected,varizMab,transactMab}
  msgPlanSelected.innerHTML ="";

  xhttp.onreadystatechange = function () {
    if (xhttp.status==200){
      msgPlanSelected.innerHTML = this.response.message;
      msgPlanSelected.classList.remove("text-danger");
      msgPlanSelected.classList.add("text-success");
    } else {
      if (this.response.done=="false") {
        msgPlanSelected.classList.remove("text-success");
        msgPlanSelected.classList.add("text-danger");
      }
      msgPlanSelected.innerHTML=this.response.message;
     
    }
  }
  xhttp.open("POST", "/dashboard/selectedPlan");
  let formData = new FormData();
  //*(change js to json data & append in formdata)
  formData.append("info",JSON.stringify(data)) ;
  xhttp.send(formData);

   
}

