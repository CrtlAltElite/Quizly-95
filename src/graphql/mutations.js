
const { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInt } = require('graphql')
const { QuestionInputType, AnswerInputType, SubmissionType } = require('./types')
const { User, Quiz, Question, Submission } = require('../models')
const {createJwtToken} = require('../util/auth')

const register = {
    type: GraphQLString, //data type of the reutrn value of register
    args: {
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
    },
    async resolve(parent,args){
        const checkUser = await User.findOne({email: args.email})
        if (checkUser){
            throw new Error('User with this email already exists')
        }
        const user = new User(args)
        await user.save()

        //create a token
        const token = createJwtToken(user)
        return token
    }
}

const login = {
    type: GraphQLString,
    args: {
        email:{type: GraphQLString},
        password: {type: GraphQLString}
    },
    async resolve(parent, args){
        const user = await User.findOne({email: args.email})
        if (!user || args.password !== user.password){
            throw new Error("Invalid Creds")
        }
        const token = createJwtToken(user)
        return token
    }
}

const createQuiz = {
    type: GraphQLString,
    args:{
        questions:{
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionInputType)))
        },
        title:{
            type:GraphQLString
        },
        description:{
            type:GraphQLString
        },
        userId:{
            type:GraphQLString
        }
    },
    async resolve(parent, args){
        // Generate slug for our quiz url
        let slugify = args.title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
        let fullSlug=''

        // Add a random int to the end of the slug, then check that the slug does not already exist
        // if it does eist we will makea  new slug
        while (true){
            let slugId = Math.floor(Math.random()*10000)
            fullSlug = `${slugify}-${slugId}`
            const existingQuiz = await Quiz.findOne({slug:fullSlug})
            if (!existingQuiz){
                break;
            }
        }

        const quiz = new Quiz({
            title: args.title,
            slug: fullSlug,
            description:args.description,
            userId:args.userId
        })

        await quiz.save()

        // Create questions from the questions list
        for (const question of args.questions){
            const questionItem = new Question(
                {
                    title: question.title,
                    correctAnswer:question.correctAnswer,
                    order: Number(question.order),
                    quizId: quiz.id    
                })
            questionItem.save()
        }

        return quiz.slug

    }
}

const submitQuiz = {
    type: GraphQLString,
    args:{
        answer:{
            type:  new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerInputType)))
        },
        userId:{
            type: GraphQLString
        },
        quizId:{
            type: GraphQLString
        }
    },
    async resolve(parent, args){
        try{
            let correct = 0
            let totalQuestions = args.answer?.length

            for (const answer of args.answer){
                const question= await Question.findById(answer.questionId)
                if (answer.answer.trim().toLowerCase()== question.correctAnswer.trim().toLowerCase()){
                    correct++
                }
            }

            const score = (correct / totalQuestions) * 100

            const submission = new Submission({
                userId: args.userId,
                quizId: args.quizId,
                score
            })

            submission.save()
            return submission.id
        }
        catch(e){
            console.log(e)
            return ''
        }

    }

}

module.exports = {register, login, createQuiz, submitQuiz}