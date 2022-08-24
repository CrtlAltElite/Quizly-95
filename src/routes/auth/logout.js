module.exports = async(req,res)=>{
    //Clear out the jwttoken
    res.cookie('jwtToken','')
    res.redirect('/auth/login')
}