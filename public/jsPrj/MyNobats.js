const RemoveNobat = async(event)=>{
    const tempId =event.target.id.split(',')
    const idDay =tempId[0]
    const idNobat =tempId[1]
    const SelectNobat = document.getElementById(`${idDay}-${idNobat}`).innerText;
    let MsgConfirm = SelectNobat;
    const params = {idDay,idNobat}
     Swal.fire({
      title: "شما می خواهید این نوبت را ابطال کنید!",
      text: MsgConfirm,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "تایید",
      cancelButtonText:"انصراف",
    }).then((result) => {
      if (result.isConfirmed) {
       axios  
       .post('/users/RemoveNobat/',{params})
       .then(function (response) {
         if (response.status==200) {
          const CardNobat = document.getElementById(`${idDay}#${idNobat}`);
          CardNobat.classList.remove('border-black');
          CardNobat.classList.add('border-danger')
          Swal.fire({
          title: "مراجعه کننده محترم",
          text: response.data.message,
          icon: "success",
          confirmButtonText:"تایید"
          });
  
         } else{
            Swal.fire({
              title: "مراجعه کننده محترم",
              text: response.data.message,
              icon: "error",
              confirmButtonText:"تایید"
              }).then((result) => {
                if (response.data.autorised==false) {
                 
                }
              })
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
    });
  
  
    
    
     
  
}