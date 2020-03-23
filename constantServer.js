let serverConstants={
    PORT:9000,
    MongoURL:"",
    S3Id:"",
    S3Key:"",
    S3Region:"",
    BucketName:""
}
if(serverConstants.MongoURL){
    serverConstants["GridFS"]=true
}else{
    serverConstants["GridFS"]=false
}

if(serverConstants.S3Id && serverConstants.S3Key && serverConstants.S3Region&& serverConstants.BucketName){
    serverConstants["S3"]=true;
}else{
    serverConstants["S3"]=false;

}
module.exports=serverConstants