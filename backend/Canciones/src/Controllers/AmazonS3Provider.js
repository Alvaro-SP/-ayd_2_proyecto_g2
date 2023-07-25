const CloudStorageProvider = require("./CloudStorageProvider");
const AWS = require("aws-sdk");
const uuid = require("uuid");

class AmazonS3Provider extends CloudStorageProvider {
  constructor(config) {
    super(config);
    this.s3 = new AWS.S3(config);
  }

  connect() {
    console.log("Conexion exitosa con Amazon S3");
  }

  async upload(cancion, extension){
    const pathCompleto = `Canciones/${uuid.v4()}.${extension}`;
    const buffer = Buffer.from(cancion, "base64");
    try {
      const bucketParams = {
        Bucket: "aymusica",
        Key: pathCompleto,
        Body: buffer,
        ContentType: "audio/mpeg",
        //ACL: "public-read",
      };
      const response = await this.s3.upload(bucketParams).promise();
      console.log("RESPONSE ", response.Location);
      return response.Location;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = AmazonS3Provider;
