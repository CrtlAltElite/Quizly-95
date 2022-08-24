const axios = require('axios')

module.exports= async (req, res)=>{
    const mutation= `
    mutation login($email: String!, $pw: String!) {
        login(email:$email, password:$pw ) 
      }
    `
    if (!req.body.email || !req.body.password){
        res.redirect('/auth/login')
        return;
    }

    try{
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            
            {
                query: mutation,
                variables: {
                    email:req.body.email,
                    pw: req.body.password
                }
            },
            {
                headers:{
                    "Content-Type": "application/json"
                }
            });
        const jwtToken = data.data.login
        res.cookie('jwtToken', jwtToken)
        res.redirect('/')
        

    }catch(e){
        console.log(e.response.data.errors)
        res.redirect('/auth/login')
    }

}