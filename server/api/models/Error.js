class Error {
    constructor(statusCode, message = null) {
      this.status = 'error';
      this.statusCode = statusCode;
      this.message = message;
    }
  
    send(res) {
      res.status(this.statusCode).json({
        status: this.status,
        statusCode: this.statusCode,
        message: this.message,
      });
    }
  }
  
  module.exports = Error;