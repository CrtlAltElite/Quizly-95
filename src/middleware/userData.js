const axios= require('axios')



const userData = async (req, res, next)=>{
    if (!req.verifiedUser){
        next()
        return
    }

    const query =`
    query user($id: ID!){
        user(id:$id){
            id,
            quizzes {
                id,
                slug,
                title,
                description,
                questions{
                    title,
                    order,
                    correctAnswer
                },
                submissions{
                    score,
                    userId
                },
                avgScore
            },

            submissions{
                id,
                userId,
                quizId,
                quiz{
                    title,
                    description
                },
                score
            }
        }
    }

    `
    let response = {}
    try {
        response = await axios.post(process.env.GRAPHQL_ENDPOINT,
            
            {
                query,
                variables:{
                    id:req.verifiedUser.user._id   
                }
            },
            
            {
                headers:{
                    "Content-Type":"application/json"
                }
            })
    }catch(e){
        console.log(e)
    }

    req.verifiedUser.user.quizzes = response.data.data.user?.quizzes ?? []
    req.verifiedUser.user.submissions = response.data.data.user?.submissions ?? []
    // console.log(req.verifiedUser)
    next()
}

module.exports = {userData}