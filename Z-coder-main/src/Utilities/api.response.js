class ApiResponse
{
    constructor(statuscode,content)
    {
        this.StatusCode=statuscode;
        this.Content=content;
        this.Success=true;
    }
}

export {ApiResponse};