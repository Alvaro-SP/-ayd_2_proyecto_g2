const AmazonS3Provider=require('./AmazonS3Provider')
class CloudStorageFactory {
    static createProvider(providerName, config) {
      switch (providerName) {
        case 'AmazonS3':
          return new AmazonS3Provider(config);
        default:
          throw new Error('Proveedor de almacenamiento en la nube no soportado');
      }
    }
  }

  module.exports=CloudStorageFactory