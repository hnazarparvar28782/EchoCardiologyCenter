
const ReservNobat = async(event)=>{
  const tempId =event.target.id.split(',')
  const idDay =tempId[0]
  const idNobat =tempId[1]
  const TagNobatSaat = document.getElementById(`nobat${idNobat}`).innerText;
  const params = {idDay,idNobat,}
  const msgResv =document.getElementById("msgResv")
  
  let MsgConfirm = `شما ساعت  ${TagNobatSaat} را جهت رزور انتخاب نمود ه اید اگر صحیح است کلید تایید را بزنید` 
  
  Swal.fire({
    title: "توجه",
    text: MsgConfirm,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "تایید",
    cancelButtonText:"انصراف",
  }).then((result) => {
    if (result.isConfirmed) {
     msgResv.value="چند لحظه لطفا......!"
     axios  
     .post('/dashboard/ReservNobat/',{params})
     .then(function (response) {
       if (response.status==200) {
        const LiElement =document.getElementById(tempId)
        const StatusIcon =document.getElementById(idNobat)
        
        const isReserv ="text-decoration-line-through";
        const textbgColor = "text-bg-danger";
        
        LiElement.classList.remove(isReserv);
        LiElement.classList.add(isReserv);

        LiElement.classList.remove(textbgColor);
        LiElement.classList.add(textbgColor);

        StatusIcon.classList.remove("fa");
        StatusIcon.classList.remove("fa-question");
        StatusIcon.classList.add("fa");
        StatusIcon.classList.add("fa-male");
        //msgResv.innerHTML=response.data.message;
        Swal.fire({
        title: "مراجعه کننده محترم",
        text: response.data.message,
        icon: "success",
        confirmButtonText:"تایید"
        });

       } else{
          //msgResv.innerHTML=response.data.message;
          Swal.fire({
            title: "مراجعه کننده محترم",
            text: response.data.message,
            icon: "error",
            confirmButtonText:"تایید"
            }).then((result) => {
              if (response.data.autorised==false) {
                //* get element of link signup sick
                const SignUpSickLink = document.getElementById("SignUpSickLink");
                SignUpSickLink.click("nobatbodem");
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

const SayNobats = async (doctorId) => {
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  console.log("SayNobats")
  const SelectedDateMil = document.getElementById("SelectedDateMil").value;
  if (SelectedDateMil) {
  const param = `SelectedDateMil=${SelectedDateMil}&id=${doctorId}&NobatInternet=true`;
  axios
    .get(`/dashboard/nobatmekham/?${param}`)
    .then(function (response) {
       if (response.status==200) {
          //*convert to javascript(or javascriptArray)
          const jscNobats = JSON.parse(response.data);
          const divnobatshow =document.getElementById('divnobatshow')
          let nobatshow =document.getElementById('nobatshow');
          if((nobatshow) && (divnobatshow)){
          //*remove ul html elemnt nobatshow
          divnobatshow.removeChild(nobatshow); 
          //* readding ul html elemnt for new data
          divnobatshow.innerHTML += '<ul class=" list-unstyled overflow-x-auto  " id="nobatshow"></ul> '
          nobatshow = document.getElementById('nobatshow');
          }
          //* for Day nobatTyp=monday or afternoon
          jscNobats.forEach(Day => {
             //*bellow "Day.nobats"  As array
          Day.nobats.forEach((nobat) => {
            const isReserv =(nobat.reserve ?" text-decoration-line-through ":" ") 
            const textbgColor =(nobat.reserve ? "text-bg-danger":"text-bg-info")
            const StatusIcon =(nobat.reserve ? `<span id="${nobat._id}" class="fa fa-male"></span>`: 
                               `<span id="${nobat._id}" class="fa fa-question"></span>`)
           
           nobatshow.innerHTML +=
           '<li class="list-inline-item '+ textbgColor +
           ' border-black border-2'+
           ' border-bottom border-top'+
           ' border-end border-start rounded-4 py-3'+isReserv+
           ' px-3 text-center  '+ 
           'mb-2"'+ `id="${Day._id},${nobat._id}" onclick="ReservNobat(event)"` +
           // ` data-bs-toggle="modal" data-bs-target="#ConfirmReserv" `+
           `><p id="nobat${nobat._id}">${nobat.nobatTime}</p><br>` + StatusIcon + `</li>`
          });
          });//*end of loop Day
         
       } else {
          //*remove ul html elemnt nobatshow
          const divnobatshow =document.getElementById('divnobatshow');
          let nobatshow =document.getElementById('nobatshow');
          divnobatshow.removeChild(nobatshow); 
          //* readding ul html elemnt for new data
          divnobatshow.innerHTML += '<ul class=" list-unstyled overflow-x-auto  " id="nobatshow"></ul> '  
          alert(response.data.message)
       }
         
    })
    .catch(function (error) {
      //* fire when statuscod =404
      alert(error);
    })
    .finally(function () {
      //alert("finally")
    });
  }//*end "if (SelectedDateMil)"
};
const SayNobatsHozri = async (doctorId) => {
  const SelectedDateMil = document.getElementById("SelectedDateMil").value;
  if (SelectedDateMil) {
  const param = `SelectedDateMil=${SelectedDateMil}&id=${doctorId}&NobatInternet=false`;
  axios
    .get(`/dashboard/nobatmekham/?${param}`)
    .then(function (response) {
       if (response.status==200) {
          //*convert to javascript(or javascriptArray)
          const jscNobats = JSON.parse(response.data);
          const divnobatshow =document.getElementById('divnobatshow')
          let nobatshow =document.getElementById('nobatshow');
          if((nobatshow) && (divnobatshow)){
          //*remove ul html elemnt nobatshow
          divnobatshow.removeChild(nobatshow); 
          //* readding ul html elemnt for new data
          divnobatshow.innerHTML += '<ul class=" list-unstyled overflow-x-auto  " id="nobatshow"></ul> '
          nobatshow = document.getElementById('nobatshow');
          }
          //* for Day nobatTyp=monday or afternoon
          jscNobats.forEach(Day => {
             //*bellow "Day.nobats"  As array
          Day.nobats.forEach((nobat) => {
            const isReserv =(nobat.reserve ?" text-decoration-line-through ":" ") 
            const textbgColor =(nobat.reserve ? "text-bg-danger":"text-bg-info")
            const StatusIcon =(nobat.reserve ? `<span id="${nobat._id}" class="fa fa-male"></span>`: 
                               `<span id="${nobat._id}" class="fa fa-question"></span>`)
           
           nobatshow.innerHTML +=
           '<li class="list-inline-item '+ textbgColor +
           ' border-black border-2'+
           ' border-bottom border-top'+
           ' border-end border-start rounded-4 py-3'+isReserv+
           ' px-3 text-center  '+ 
           'mb-2"'+ `id="${Day._id},${nobat._id}" onclick="ReservNobatHozri(event)"` +
           // ` data-bs-toggle="modal" data-bs-target="#ConfirmReserv" `+
           `><p id="nobat${nobat._id}">${nobat.nobatTime}</p><br>` + StatusIcon + `</li>`
          });
          });//*end of loop Day
         
       } else {
          //*remove ul html elemnt nobatshow
          const divnobatshow =document.getElementById('divnobatshow');
          let nobatshow =document.getElementById('nobatshow');
          divnobatshow.removeChild(nobatshow); 
          //* readding ul html elemnt for new data
          divnobatshow.innerHTML += '<ul class=" list-unstyled overflow-x-auto  " id="nobatshow"></ul> '  
          alert(response.data.message)
       }
         
    })
    .catch(function (error) {
      //* fire when statuscod =404
      alert(error);
    })
    .finally(function () {
      //alert("finally")
    });
  }//*end "if (SelectedDateMil)"
};
const ReservNobatHozri = async(event)=>{
  const tempId =event.target.id.split(',')
  const idDay =tempId[0]
  const idNobat =tempId[1]
  const codemilli = document.getElementById("SSCodemilli").innerHTML
  const MobileId = document.getElementById("SSMobileId").innerHTML
  const FullName = document.getElementById("SSFullname").innerHTML
  const TagNobatSaat = document.getElementById(`nobat${idNobat}`).innerText;
  const params = {idDay,idNobat,codemilli,MobileId,FullName}
  const msgResv =document.getElementById("msgResv")
  
  let MsgConfirm = `شما ساعت  ${TagNobatSaat} را جهت رزور انتخاب نمود ه اید اگر صحیح است کلید تایید را بزنید` 
  
  Swal.fire({
    title: "توجه",
    text: MsgConfirm,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "تایید",
    cancelButtonText:"انصراف",
  }).then((result) => {
    if (result.isConfirmed) {
     msgResv.value="چند لحظه لطفا......!"
     axios  
     .post('/dashboard/ReservNobatHozri/',{params})
     .then(function (response) {
       if (response.status==200) {
        const LiElement =document.getElementById(tempId)
        const StatusIcon =document.getElementById(idNobat)
        
        const isReserv ="text-decoration-line-through";
        const textbgColor = "text-bg-danger";
        
        LiElement.classList.remove(isReserv);
        LiElement.classList.add(isReserv);

        LiElement.classList.remove(textbgColor);
        LiElement.classList.add(textbgColor);

        StatusIcon.classList.remove("fa");
        StatusIcon.classList.remove("fa-question");
        StatusIcon.classList.add("fa");
        StatusIcon.classList.add("fa-male");
        //msgResv.innerHTML=response.data.message;
        Swal.fire({
        title: "کاربر محترم",
        text: response.data.message,
        icon: "success",
        confirmButtonText:"تایید"
        });

       } else{
          //msgResv.innerHTML=response.data.message;
          Swal.fire({
            title: "کاربر محترم",
            text: response.data.message,
            icon: "error",
            confirmButtonText:"تایید"
            }).then((result) => {
              if (response.data.autorised==false) {
                //* get element of link signup sick
                const SignUpSickLink = document.getElementById("SignUpSickLink");
                SignUpSickLink.click("nobatbodem");
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

