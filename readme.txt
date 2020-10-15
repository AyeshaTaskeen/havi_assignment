This Project is built using HTML, JAVASCRIPT and CSS as a front end technologies and connected to the Amazon Dynamo DB using Lambda Fucntion and Api gateway.

This project is a replica of signup and signin forms, here the user has to signup by entering certain fields and the contact number should be unique which means it should not reside in db before if it is existing user there will be an alert to sign in. 

PROJECT LINK:
https://ayeshataskeen.github.io/havi_assignment/

API lINKS:

1)This API is used to login by submitting the contact number in the api and also to get the list entered by user.
https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user?contact_number=""

2)This API is used to post data to dynamo db.
https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/user

4)This API is used to post the list and entered by user to populate.
https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/list

6)This API is used to get all users from db to show in admin grid.
https://zezm09x6u5.execute-api.ap-south-1.amazonaws.com/Dev/getallusers



DATABASE USED: Amazon Dynamo DB
TABLE NAME:haviAssignment

LAMBDA FUNCTIONS:

1.havi_Assignment_GetAllUsers:

Below Function is used to get all the users from the db to populate into admin grid.

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


2.havi_Assignmentlist_put:

Below Function is used to put the data into list as entered by user after login

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


3.haviAssignment_Post:

Below Function is written to save the details of the new user into db.

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


4.haviAssignment_Get

Below Function is used to get the user based on contact number to verify login

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
