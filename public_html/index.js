
const jpdbBaseUrl = "http://api.login2explore.com:5577";
const jpdbIRL = '/api/irl';
const jpdbIML = '/api/iml';
const stdDBName = "SCHOOL-DB";
const stdRelationName = "STUDENT-TABLE";
const connToken = "90931249|-31949329452589251|90960948";

$('#roll').focus();   

function resetForm(){
    $('#roll').val("");
    $('#fName').val("");
    $('#class').val("");
    $('#dob').val("");
    $('#address').val("");
    $('#en').val("");

    $('#roll').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);

    $('#roll').focus();
}

function validateData(){
    var roll = $('#roll').val();
    var fName = $('#fName').val();
    var Class = $('#class').val();
    var dob = $('#dob').val();
    var address = $('#address').val();
    var en = $('#en').val();

    if(roll === ''){
        alert("Student ID is missing");
        $('#roll').focus();
        return "";
    }
    if(fName === ''){
        alert("Name is missing");
        $('#fName').focus();
        return "";
    }
    if(Class === ''){
        alert("Class is missing");
        $('#class').focus();
        return "";
    }
    if(dob === ''){
        alert("DOB is missing");
        $('#dob').focus();
        return "";
    }
    if(address === ''){
        alert("Address is missing");
        $('#address').focus();
        return "";
    }
    if(en === ''){
        alert("Enrollment is missing");
        $('#en').focus();
        return "";
    }

    var jsonStrObj = {
        roll: roll,
        name: fName,
        class : Class,
        dob : dob,
        address : address,
        enrollment : en
    };

    return JSON.stringify(jsonStrObj);
}

function getRollAsJsonObj(){
    var rollNo = $('#roll').val();
    var jsonStr = {
        roll : rollNo
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj){
    var lsData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lsData.rec_no);                 // setting the rec. no in the LS and getting data from it later
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#fName').val(record.name);
    $('#class').val(record.class);
    $('#dob').val(record.dob);
    $('#address').val(record.address);
    $('#en').val(record.enrollment);
}

function saveStudent(){
    var jsonStrObj = validateData();
    if(jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl( putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async : true});
    resetForm();
    $('#roll').focus();
}

function updateStudent(){
    $('#change').prop("disabled", true);
    var jsonChg = validateData();                                          // I added var here
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName, stdRelationName, localStorage.getItem("recno") );
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async : true});
    console.log(resJsonObj);
    resetForm();
    $('#roll').focus();
}

function getStd(){
    var rollJsonObj = getRollAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, rollJsonObj);
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async : true});
    
    if(resJsonObj.status === 400){                 // request fail
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#fName').focus();
        
    } else if(resJsonObj.status === 200){         // request success
        
        $('#roll').prop("disabled", true);
        fillData(resJsonObj);

        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#fName').focus();        
        
    }
}

