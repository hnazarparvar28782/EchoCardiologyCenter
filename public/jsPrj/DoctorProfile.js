const SabtNazar =async(DoctorFullName , DoctorId ,KarbarFullName , KarbarId )=>{
       
  Swal.fire({
    title: `ثبت نظر برای دکتر ${DoctorFullName}`,
      input: "textarea",
      html: `
      <p class="text-danger h3">با ستاره به دکتر امتیاز بدین</p>
      <div class="row col-lg-4">
      <p onclick="ChangeStar('Star1')" class="col-1 text-primary m-0"><i id="Star1"  class="fa fa-star-o"></i></p>
      <p onclick="ChangeStar('Star2')" class="col-1 text-primary m-0"><i id="Star2"  class="fa fa-star-o "></i></p>
      <p onclick="ChangeStar('Star3')" class="col-1 text-primary m-0"><i id="Star3"  class="fa fa-star-o "></i></p>
      <p onclick="ChangeStar('Star4')" class="col-1 text-primary m-0"><i id="Star4"  class="fa fa-star-o "></i></p>
      </div>
        `,
      inputPlaceholder: "نظرتون رو اینجا بنویسید...",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "ثبت نظر",
      cancelButtonText: "انصراف",
      showLoaderOnConfirm: true,
    preConfirm: async (login) => {
      try {
        //* axios parameters and config for sending request
       const NazarKarbar=login;
       const SumStars = SumStar(); 
       const params = {DoctorFullName , DoctorId ,KarbarFullName , KarbarId,NazarKarbar,SumStars}
       const response = await axios.post('/dashboard/SabtNazar/',params)
       
        if ((response.status==202)||(response.status==201)) {
          Swal.showValidationMessage(`
           خطا : ${response.data.message}
          `);
        }
        //* there is not error next code run
        return response.data.message;//* sent mesage to result
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }//*end of try catch
    },//* end preconfirm
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: `${result.value}`,
      });
    }
  });

Download & insta
}

const ChangeStar=(StarId)=>{
 const SelectedStar = document.getElementById(`${StarId}`);
 if (SelectedStar.classList=="fa fa-star-o") {
     SelectedStar.classList.remove("fa-star-o");
     SelectedStar.classList.add("fa-star");
 } else {
     SelectedStar.classList.remove("fa-star");
     SelectedStar.classList.add("fa-star-o");
 }
}

const SumStar =()=>{
  const Star1 = document.getElementById("Star1");
  const Star2 = document.getElementById("Star2");
  const Star3 = document.getElementById("Star3");
  const Star4 = document.getElementById("Star4");
  let SumSt =0;
  SumSt=(Star1.classList=="fa fa-star"?SumSt+1:SumSt)
  SumSt=(Star2.classList=="fa fa-star"?SumSt+1:SumSt)
  SumSt=(Star3.classList=="fa fa-star"?SumSt+1:SumSt)
  SumSt=(Star4.classList=="fa fa-star"?SumSt+1:SumSt)
  return SumSt;
}
