
const OpenInPaintErro =(event)=>{
  
  const ImageVisit = document.getElementById(event.id);
  const CarouselHanddoctor =document.getElementById("CarouselHanddoctor");
  CarouselHanddoctor.hidden=true;
  const PathVistPic = ImageVisit.id;
  const myArray = event.id.split("/");
  const SickCodeMilli =myArray[3];
  var ptro = Painterro({
     hideByEsc:true,
     buttonSizePx:16,
     toolbarHeightPx:20,
     onClose:function (){
        CarouselHanddoctor.hidden=false;
     },

    
    saveHandler: function (image, done) {
      let xhttp = new XMLHttpRequest();
      xhttp.responseType = "json";
    //* send data by Form Data...  
      let formData = new FormData();
      formData.append('HandDoctrorImage',  image.asBlob(),image.suggestedFileName());
      formData.append('SickCodeMilli',SickCodeMilli);
      formData.append('FilePic',PathVistPic);
      xhttp.open("POST", "/dashboard/SaveEditHandDoctor");
      xhttp.send(formData);
  
      xhttp.onreadystatechange = function () {
        if (xhttp.status==200){
          alert(this.response.message)
          done(true);//* heid painterro
          location.reload()
        
        } else {
          if (this.response.done=="false") {
            alert(this.response.message)
            done(false);//* leave painterro
            location.reload()
          }
          alert(this.response.message)
          done(false);
          location.reload()
        }
      }
    },
    
      
  })
  ptro.show(PathVistPic);
  
}
const OpenNewPageInPainErro =(event)=>{
 const SickCodeMilli =event.id;
 const CarouselHanddoctor =document.getElementById("CarouselHanddoctor");
 CarouselHanddoctor.hidden=true;
 var ptro = Painterro({
  //  id:IdPaintscren.id,
   hideByEsc:true,
   buttonSizePx:32,
   toolbarHeightPx:50,
   onClose:function (){
    CarouselHanddoctor.hidden=false;
 },

  saveHandler: function (image, done) {
    let xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";
  //* send data by Form Data...  
    let formData = new FormData();
    formData.append('HandDoctrorImage',  image.asBlob(),image.suggestedFileName());
    formData.append('SickCodeMilli',SickCodeMilli);
    xhttp.open("POST", "/dashboard/SaveHandDoctor");
    xhttp.send(formData);
    
    //* start xhttp.onreadystatechange
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) { // بررسی اینکه درخواست کامل شده است 
        if (xhttp.status==200){
        alert(this.response.message)
        done(true);//* heid painterro
        location.reload();
        } else {
        if (this.response.done=="false") {
          alert(this.response.message)
          done(false);//* leave painterro
          location.reload();
        }
        alert(this.response.message)
        done(false);
        location.reload();
        }
      }
    }
    //* end xhttp.onreadystatechange
  }
})
ptro.show();
}
