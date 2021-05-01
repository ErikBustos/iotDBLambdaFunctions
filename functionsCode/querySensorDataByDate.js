// Loads in the AWS SDK
const AWS = require('aws-sdk'); 

const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'}); 

exports.handler = async (event, context, callback) => {
    // Handle promise fulfilled/rejected states
    await getsensorsDatabyDate(event.queryStringParameters).then((data) => {
        callback(null, {
            statusCode: 200,
            body: stringSuccessMessage(data),
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


function getsensorsDatabyDate(event) {
    console.log(event);
    const params = {
        TableName: 'sensorsData',
        FilterExpression: "contains(#date, :date)",
        ExpressionAttributeNames: {
            "#date": "timestamp"
        },
        ExpressionAttributeValues: {
            ":date": event.date
        }
    }
    return ddb.scan(params).promise();
}

function stringSuccessMessage(data){
    let json = {
        "message" : "Found a match",
        "sensors": data
    }
    return JSON.stringify(json);
}