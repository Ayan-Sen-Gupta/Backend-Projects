const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) => {
    
    let bucket = new AWS.S3({
       accessKeyId: process.env.IAM_ACCESS_KEY_ID,
       secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
  })

       var params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: filename,
          Body: data,
          ACL: 'public-read'
       }    
       
    
    return new Promise((resolve,reject) => {
      bucket.upload(params, (err, response) => {
           if(err){
              console.log('Something went wrong', err);
              reject(err);
            }else{
              console.log('success', response);
              resolve(response.Location);
           }      
       })
    })
}

module.exports = {
   uploadToS3
 }