const AWS = require('aws-sdk');

// Creates the document client specifing the region 
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    console.log(event);
    
    // Captures the requestId from the context message
    const requestId = context.awsRequestId;
    
    const params = {
        TableName: 'usersT2',
        Item: {
          "email": event.request.userAttributes.email,
          "Farms": [],
          "name": event.request.userAttributes.name,
          "userId": requestId
        }
    }
    
    await ddb.put(params).promise().then(() => {
       console.log("Success");
        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true; 
       context.done(null, event);
    }).catch((err) => {
        console.error(err)
        context.done(null, event);
    })
};