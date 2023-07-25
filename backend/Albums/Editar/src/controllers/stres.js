const aws = require("aws-sdk");
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
const awsKeyS3 = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
};

const s3 = new aws.S3(awsKeyS3);
const uuid = require("uuid");

const cargarImangeS3 = async (imagen, extension) => {

    const pathCompleto = `Album_portadas/${uuid.v4()}.${extension}`;
    const buffer = Buffer.from(imagen, "base64");
    try {
        const bucketParams = {
            Bucket: "aymusica",
            Key: pathCompleto,
            Body: buffer,
            ContentType: "image",
            //ACL: "public-read",
        };
        const response = await s3.upload(bucketParams).promise();
        console.log("RESPONSE ", response.Location);
        return response.Location;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// obtener imagen de url
const getImagen = async (url) => {
    try {
        const bucketParams = {
            Bucket: 'practica2-g4',
            Key: url,
        };
        const response = await s3.getObject(bucketParams).promise();
       // console.log("RESPONSE ", response.Body);
        return response.Body;
    }
    catch (err) {
        console.log("ERROR:", err);
        throw err;
    }
};

module.exports = {
    cargarImangeS3,
    getImagen,
}