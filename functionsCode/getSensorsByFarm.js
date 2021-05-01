// Loads in the AWS SDK
const AWS = require('aws-sdk'); 

const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = async (event, context, callback) => {
    // Handle promise fulfilled/rejected states
    await getsensorsbyfarm(event.body).then((data) => {
        callback(null, {
            statusCode: 200,
            body: stringSuccessMessage(data.Items[0].sensors),
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

function getsensorsbyfarm(event) {
    event = JSON.parse(event);
    const params = {
        TableName: 'farms',
        KeyConditionExpression: "#farmId = :farmId",
        ExpressionAttributeNames: {
            "#farmId": "farmId"
        },
        ExpressionAttributeValues: {
            ":farmId": event.farmId
        }
    }
    return ddb.query(params).promise();
}

function stringSuccessMessage(data){
    let json = {
        "message" : "Found a match",
        "sensors": data
    }
    return JSON.stringify(json);
}