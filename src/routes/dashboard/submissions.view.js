module.exports = (req, res)=>{

    res.render('submission', {user: req.verifiedUser.user})
}