const authenticatedCheek=(req,res,next)=>{
    if (req.isAuthenticated()) { return next()}
    res.redirect("/404")
 }
 export {authenticatedCheek}