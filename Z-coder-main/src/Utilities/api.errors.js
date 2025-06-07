class ApiErrors
{
    constructor(statuscode,Message,error){
        this.Message=Message;
        this.StatusCode=statuscode;
        this.success=false;
    }
}

export {ApiErrors};