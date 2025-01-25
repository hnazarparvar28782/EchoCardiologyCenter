
const DoSabtSick = async()=>{
  const FullName =document.getElementById("FullNameId").value;
  const codemilli =document.getElementById("CodemilliId").value;
  const Email =document.getElementById("Email").value;
  const mobileId =document.getElementById("mobileIdId2").value;
  const PassWord =document.getElementById("PassWordId2").value;
  const RepassWord =document.getElementById("RepassWordId").value;
  
      axios  
       .post('/dashboard/DosabtSick', {FullName,codemilli,Email,
             mobileId,PassWord,RepassWord,}
            )
       .then(function (response) {
        
         if (response.status==200) {
            Swal.fire({
               title: "مراجعه کننده محترم",
               text: response.data.message,
               icon: "success",
               confirmButtonText:"تایید"
            }).then((result) => {
               location.replace("/dashboard")
            });
            //axios.get("/dashboard")
         } else{
            Swal.fire({
                title: "مراجعه کننده محترم",
                text: response.data.message,
                icon: "error",
                confirmButtonText:"تایید"
                });
         }
  
         
         
      })
      .catch(function (error) {
        // handle error
        alert(error)
    
      })
      .finally(function () {
       // alert("finally")
      });
  
}
  
const DoSabtEditSick = async()=>{
   const FullName =document.getElementById("FullNameId").value;
   const codemilli =document.getElementById("CodemilliId").value;
   const Email =document.getElementById("Email").value;
   const mobileId =document.getElementById("mobileIdId2").value;
   const PassWord =document.getElementById("PassWordId2").value;
   const RepassWord =document.getElementById("RepassWordId").value;
   
       axios  
        .post('/dashboard/DosabtEditSick', {FullName,codemilli,Email,
              mobileId,PassWord,RepassWord,}
             )
        .then(function (response) {
         
          if (response.status==200) {
             Swal.fire({
                title: "مراجعه کننده محترم",
                text: response.data.message,
                icon: "success",
                confirmButtonText:"تایید"
             }).then((result) => {
                location.replace("/dashboard")
             });
             //axios.get("/dashboard")
          } else{
             Swal.fire({
                 title: "مراجعه کننده محترم",
                 text: response.data.message,
                 icon: "error",
                 confirmButtonText:"تایید"
                 });
          }
   
          
          
       })
       .catch(function (error) {
         // handle error
         alert(error)
     
       })
       .finally(function () {
        // alert("finally")
       });
   
 }