// Loads in the AWS SDK
const AWS = require('aws-sdk'); 

const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = async (event, context, callback) => {
    // Handle promise fulfilled/rejected states
    await getFarmsbyEmail(event.body).then((data) => {
        callback(null, {
            statusCode: 201,
            body: stringSuccessMessage(data.Items[0].Farms),
            isBase64Encoded: false,
            headers: {
                "Content-Type" : "application/json"
            },
        });
    }).catch((err) => {
        console.error(err)
            callback(null, 
                err
            );
    })
};

// Function readMessage
// Reads 10 messages from the DynamoDb table Message
// Returns promise

function getFarmsbyEmail(event) {
    event = JSON.parse(event);
    const params = {
        TableName: 'usersT2',
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email": event.email
        }
    }
    return ddb.query(params).promise();
}

function stringSuccessMessage(data){
    let json = {
        "message" : "Found a match",
        "farms": data
    }
    return JSON.stringify(json);
}