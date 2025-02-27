
const getError404 = (req,res) => { 
   console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
   console.log("Hassan! you stay in section's 404 not found!!! ")
  
   let errormsg = req.flash('error');
   if (errormsg==undefined)errormsg="";
    res.status(404).render("errors/404", {errormsg, pageTitle: "صفحه مورد نظر پیدا نشد" ,path:"/404" });
 }

 const getError500 = (req,res) => { 
    res.status(500).render("errors/500", { pageTitle: " خطای سمت سرور" ,path:"/500"});
 }

 export {getError404,getError500}