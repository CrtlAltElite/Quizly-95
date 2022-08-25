module.exports = (req, res)=>{
    res.render('quiz-success', {slug:req.params.slug})
}