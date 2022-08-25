const axios = require('axios')

module.exports = async (req,res)=>{
    const slug = req.params.slug
    let answers=[]
    let submissionId=''

    for (const qid in req.body){
        if (qid !=='quizId'){
            answers.push({
                questionId: qid,
                answer: String(req.body[qid])
            })
        }
    }

    const mutation = `
        mutation submitQuiz($userId: String!, $quizId: String!, $answer: [AnswerInput!]!){
            submitQuiz(userId: $userId, quizId: $quizId, answer: $answer)
        }
    `

    try{
        const {data} = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables:{
                    quizId: req.body.quizId,
                    userId: req.verifiedUser.user._id,
                    answer:answers
                }
            },
            {
                headers:{'Content-Type': 'application/json'}
            }
            );
        submissionId= data.data.submitQuiz
    }catch(e){console.error(e)}
    res.redirect(`/quiz/results/${submissionId}`)
}
