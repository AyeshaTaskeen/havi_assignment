API links:
1)"https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number="
2)'https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user'
3)"https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number="
4)'https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/list'
5)"https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number="
6)"https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/getallusers"

lambda functions:
//havi_Assignment_GetAllUsers:
const AWS=require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const docClient = new AWS.DynamoDB.DocumentClient({region:"ap-south-1"});
exports.handler =  (event, context,callback) => {
    let data ={ 
        TableName:"haviAssignment",
    };
    queryDynamo(data, callback, function (data) {
        callback(null,data);
    }); 
};
function queryDynamo(params, callback, callbackFn) { 
    docClient.scan(params, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            if (typeof callbackFn === "function") {
                callbackFn(data);
            }
        }
    });
}


//havi_Assignmentlist_put:
'use strict'
const AWS=require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const documentClient = new AWS.DynamoDB.DocumentClient({region:"ap-south-1"});
exports.handler =  (event,context,callback) => { 
    var params={ 
        TableName:"haviAssignment",
        Key:{
            "contact_number":event.contact_number
        },
        UpdateExpression: "set entered_list = :list",
        ExpressionAttributeValues:{
            ":list":event.list,
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    documentClient.update(params,function(err,data){
        if(err){
            callback(err,null);
        }else{
            callback(null,data);
        }
    });
};


//haviAssignment_Post:
'use strict'
const AWS=require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const documentClient = new AWS.DynamoDB.DocumentClient({region:"ap-south-1"});
exports.handler =  (event,context,callback) => { 
    var params={ 
        TableName:"haviAssignment", 
        Item: { 
            "contact_number": event.contact_number,
            "first_name": event.first_name, 
            "last_name": event.last_name,
            "DOB":event.DOB,
            "email_id":event.email_id,
            "password": event.password
        },
        ConditionExpression: "attribute_not_exists(contact_number)",
        ReturnValues: "ALL_OLD"
    };
    documentClient.put(params,function(err,data){
        if(err){
            callback(err,null);
        }else{
            callback(null,data);
        }
    });
};


//haviAssignment_Get
const AWS=require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const docClient = new AWS.DynamoDB.DocumentClient({region:"ap-south-1"});
exports.handler =  (event, context,callback) => {
    let checkIfUserExists = {
        TableName:"haviAssignment",
        KeyConditionExpression: '#contact_number = :contact_number',
        ExpressionAttributeNames: { '#contact_number': "contact_number" },
        ExpressionAttributeValues: { ':contact_number':event.params.querystring.contact_number.trim() }
    };
    queryDynamo(checkIfUserExists, callback, function (data) {
        if (data.Count == 0) {
            callback(null,data);
        }else{
            callback(null,data);
        }
    });
};
function queryDynamo(params, callback, callbackFn) {
    docClient.query(params, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            if (typeof callbackFn === "function") {
                callbackFn(data);
            }
        }
    });
}