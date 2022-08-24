const axios = require('axios');

module.exports = async (req, res)=>{
    const mutation = `
    mutation registerUser($username: String!, $email: String!, $pw: String!) {
        register(username:$username, email:$email, password:$pw ) 
      }
    `
      if (req.body.password !== req.body.confirmPassword){
          res.send({error: "Your password do not match"})
          return;
      }

      try{

        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            
            {
                query: mutation,
                variables: {
                    email:req.body.email,
                    pw: req.body.password,
                    username:req.body.username
                }
            },
            {
                headers:{
                    "Content-Type": "application/json"
                }
            });
        const jwtToken = data.data.register
        res.cookie('jwtToken', jwtToken)
        res.redirect('/')
      }catch(e){
        console.log(e)
        res.redirect('/auth/register')

      }

}