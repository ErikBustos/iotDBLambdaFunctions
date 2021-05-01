const AWS = require('aws-sdk');

// Creates the document client specifing the region 
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

    
exports.handler = async (event, context, callback) => {

    
    await getSensorsData(event.body).then((data) => {
        callback(null, {
            statusCode: 200,
            body: stringSuccessMessage(data.Items[0].sensorData),
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

function getSensorsData(event) {
    event = JSON.parse(event);
    const params = {
        TableName: 'sensors',
        KeyConditionExpression: "#sensorid = :macidValue",
        ExpressionAttributeNames: {
            "#sensorid": "sensorId"
        },
        ExpressionAttributeValues: {
            ":macidValue": event.macid
        }
    }
    return ddb.query(params).promise();
}

function stringSuccessMessage(data){
    let json = {
        "message" : "Found a match",
        "data": data
    }
    return JSON.stringify(json);
}