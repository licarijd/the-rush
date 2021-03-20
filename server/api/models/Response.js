const HTTPStatus = require('http-status');

class Response {
  constructor(data, statusCode = HTTPStatus.OK) {
    this.data = data;
    this.statusCode = statusCode;
  }

  send(res) {
    res.status(this.statusCode).json({ status: this.statusCode, data: this.data });
  }
}

module.exports = Response;