document.getElementById("uploadMadrak").onclick = function () {
    console.log("image uploding is strated!!!!!!!!!!!!!!!!!!!")
    let xhttp = new XMLHttpRequest(); //create Ajax request
    const sendStatus = document.getElementById("sendStatus");
    const uploadfiledoctor = document.getElementById("uploadfiledoctor");
    const progressBar=document.getElementById("progressBar");
    const progressDiv=document.getElementById("progressDiv");
    const sendReport=document.getElementById("sendReport");
    
    xhttp.responseType = "json";
    xhttp.onreadystatechange = function () {
      if (xhttp.status==200){
        sendStatus.innerHTML = this.response.message;
        sendReport.innerHTML=this.response.address;
        uploadfiledoctor.value="";
      } else {
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
      xhttp.send(formData);
    } else {
      sendStatus.innerHTML="برای آپلود عکس حتما باید فایلی انتخاب شود!"
    }
  
  };
  