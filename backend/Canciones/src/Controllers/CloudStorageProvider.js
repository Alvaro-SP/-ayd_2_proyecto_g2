class CloudStorageProvider {
  constructor(config) {
    this.config = config;
  }

  connect() {}
  async upload(cancion, extension) {}
}
module.exports = CloudStorageProvider;
