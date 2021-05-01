const AWS = require('aws-sdk');

// Creates the document client specifing the region 
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event, context, callback) => {
    //console.log("event: " + event)
    // Captures the requestId from the context message
    const requestId = context.awsRequestId;
    
    // Handle promise fulfilled/rejected states
    await pushSensorsData(event.body, requestId).then(() => {
        console.log("reached success")
        callback(null, {
            statusCode: 201,
            isBase64Encoded: false,
            headers: {
                "Content-Type" : "application/json"
            },
            body: stringSuccessMessage(requestId)
            
        });
    }).catch((err) => {
        console.error("Error: " + err)
            callback(null, 
                err
            );
    })
};

// Function createMessage
// Writes message to DynamoDb table sensorsData 
function pushSensorsData(event, requestId) {
    event = JSON.parse(event);
    const params = {
        TableName: 'sensorsData',
        Item: {
            'sensorDataId' : requestId,
            'rainDrops' : event.rainDrops,
             "airHumidity": event.airHumidity,
             "light": event.light,
             "airTemperature": event.airTemperature,
             "soilHumidity": event.soilHumidity,
             "timestamp": event.timestamp
        }
    }
    return ddb.put(params).promise();
}

function stringSuccessMessage(requestId){
    let json = {
    "message" : "Sensor Data created",
    "sensorDataId": requestId
    }
    
    return JSON.stringify(json);
}