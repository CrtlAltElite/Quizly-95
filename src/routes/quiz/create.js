const axios = require('axios')


// {
//     quizTitle: 'my title',
//     quizDescription: 'my desc',
//     questionTitle0: 'q1',
//     questionAnswer0: 'a1',
//     questionTitle1: 'q2',
//     questionAnswer1: 'a2'
//   }

module.exports = async (req, res) =>{
    const quizInputs = req.body
    const quizData = {
        userId: req.verifiedUser.user._id,
        title: quizInputs['quizTitle'],
        description: quizInputs['quizDescription'],
        questions:[]
    }

    for (const key in quizInputs){
        if(key.includes('questionTitle')){
            const questionNum = parseInt(key.split('questionTitle')[1])
            if (!quizData.questions[questionNum]){
                quizData.questions.push({})
            }
            quizData.questions[questionNum].title =  quizInputs[key]
        }else if (key.includes('questionAnswer')){
            const questionNum = parseInt(key.split('questionAnswer')[1])
            quizData.questions[questionNum].correctAnswer =  quizInputs[key]
            quizData.questions[questionNum].order = questionNum + 1
        }
    }

    const mutation =`
    mutation createQuiz($userId: String!, $title:String!, $description: String!, $questions: [QuestionInput!]!){
        createQuiz(userId: $userId, title:$title, description: $description, questions: $questions)
    }
    `
    let quizSlug
    try{
        const {data} = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables: quizData
            },{
                headers:{
                    "Content-Type":"application/json"
                }
            }
        );
        console.log(data)
        quizSlug = data.data.createQuiz
    }catch(e){
        console.error(e)
    }
    res.redirect(`/quiz/success/${quizSlug}`)
    

}