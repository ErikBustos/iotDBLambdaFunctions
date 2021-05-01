const AWS = require('aws-sdk');

// Creates the document client specifing the region 
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    // Captures the requestId from the context message
    //const requestId = context.awsRequestId;
    let macid =  JSON.parse(event.body)
    macid= macid.macid;
 // Handle promise fulfilled/rejected states
    await updateSensorData(event.body).then(() => {
        callback(null, {
            statusCode: 201,
            isBase64Encoded: false,
            headers: {
                "Content-Type" : "application/json"
            },
            body: stringSuccessMessage(macid)
        });
    }).catch((err) => {
        console.error(err)
            callback(null, 
                err
            );
    })
};

function updateSensorData(event) {
        event = JSON.parse(event);
    
        let dataToUpdate = event.sensorDataids;
        dataToUpdate.push(event.newsensorDataId);
        
        const params = {
        TableName: 'sensors',
        Key: {
            "sensorId" :event.macid
            },
        UpdateExpression: "set #sensorData = :a",
        ExpressionAttributeNames: {
            "#sensorData": "sensorData",
        },
        ExpressionAttributeValues:{
            ":a": dataToUpdate
        },
        ReturnValues:"UPDATED_NEW"
    }
    return ddb.update(params).promise();
}

function stringSuccessMessage(macid){
    let json = {
    "message" : "Updated Sensor Info",
    "sensorId" : macid
    }
    
    return JSON.stringify(json);
}