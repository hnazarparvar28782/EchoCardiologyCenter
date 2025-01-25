
const SelctSick=(e)=>{
   const ListSickTable = document.getElementById("ListSickTable");
   const row =ListSickTable.rows[e.rowIndex];//*selcted row
   const FullName = row.cells[0].innerHTML;
   const mobileId = row.cells[1].innerHTML;
   const codemilli = row.cells[2].innerHTML;

   document.getElementById("SSFullname").style.display="block";
   document.getElementById("SSMobileId").style.display="block";
   document.getElementById("SSCodemilli").style.display="block";

   document.getElementById("SSFullname").innerHTML=FullName;
   document.getElementById("SSMobileId").innerHTML=mobileId;
   document.getElementById("SSCodemilli").innerHTML=codemilli;

}

const DoSabtSick = async()=>{
    const FullName =document.getElementById("FullNameId").value;
    const codemilli =document.getElementById("CodemilliId").value;
    const Email ="RegisteredH@gmail.com";
    const mobileId =document.getElementById("mobileIdId2").value;
    const PassWord =document.getElementById("PassWordId2").value;
    const RepassWord =document.getElementById("RepassWordId").value;
    
        axios  
         .post('/dashboard/DosabtSickHozri', {FullName,codemilli,Email,
               mobileId,PassWord,RepassWord,}
              )
         .then(function (response) {
          
           if (response.status==200) {
              Swal.fire({
                 title: "پزشک محترم",
                 text: response.data.message,
                 icon: "success",
                 confirmButtonText:"تایید"
              }).then((result) => {
               //   location.replace("/dashboard")
              });
              //axios.get("/dashboard")
           } else{
              Swal.fire({
                  title: "کاربر گرامی",
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

function sortTable(n) {
   var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
   table = document.getElementById("ListSickTable");
   switching = true;
   //Set the sorting direction to ascending:
   dir = "asc"; 
   /*Make a loop that will continue until
   no switching has been done:*/
   while (switching) {
     //start by saying: no switching is done:
     switching = false;
     rows = table.rows;
     /*Loop through all table rows (except the
     first, which contains table headers):*/
     for (i = 1; i < (rows.length - 1); i++) {
       //start by saying there should be no switching:
       shouldSwitch = false;
       /*Get the two elements you want to compare,
       one from current row and one from the next:*/
       x = rows[i].getElementsByTagName("TD")[n];
       y = rows[i + 1].getElementsByTagName("TD")[n];
       /*check if the two rows should switch place,
       based on the direction, asc or desc:*/
       if (dir == "asc") {
         if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
           //if so, mark as a switch and break the loop:
           shouldSwitch= true;
           break;
         }
       } else if (dir == "desc") {
         if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
           //if so, mark as a switch and break the loop:
           shouldSwitch = true;
           break;
         }
       }
     }
     if (shouldSwitch) {
       /*If a switch has been marked, make the switch
       and mark that a switch has been done:*/
       rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
       switching = true;
       //Each time a switch is done, increase this count by 1:
       switchcount ++;      
     } else {
       /*If no switching has been done AND the direction is "asc",
       set the direction to "desc" and run the while loop again.*/
       if (switchcount == 0 && dir == "asc") {
         dir = "desc";
         switching = true;
       }
     }
   }
}

const OpenCloseNav = ()=>{
  const collapse =document.getElementById("navbarCollapse")
  collapse.collapse('hide');
}           
