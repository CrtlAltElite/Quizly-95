const { GraphQLList, GraphQLID, GraphQLString } = require('graphql')
const { UserType, QuizType, SubmissionType } = require('./types')
const { User, Quiz, Submission } = require('../models')

const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users in the database',
    resolve(parent, args){
        return User.find()
    }
}

const user = {
    type: UserType,
    description: 'Query user by id',
    args:{
        id:{ type: GraphQLID }
    },
    resolve(parent, args){
        return User.findById(args.id)
    }
}

const quizBySlug = {
    type: QuizType,
    description: 'Query Quiz by Slug value',
    args:{
        slug: {type: GraphQLString}
    },
    resolve(parent,args){
        return Quiz.findOne({slug: args.slug})
    }
}

const submissionById={
    type:SubmissionType,
    description: 'Query quiz by Submission ID',
    args:{
        id:{type: GraphQLString}
    },
    resolve(parent, args){
        return Submission.findById(args.id)
    }
}


module.exports = {users, user, quizBySlug, submissionById}