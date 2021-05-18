const AWS = require("aws-sdk");
const securePin = require("secure-pin");

const sns = new AWS.SNS({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "sa-east-1",
});

module.exports = {
  async generatePin(length = 6) {
    return new Promise((res) => {
      securePin.generatePin(length, (pin) => {
        res(pin);
      });
    });
  },
  async sendPin(phone, token) {
    let params = {
      PhoneNumber: phone,
      Message: `MedCare Login: ${token}, utilize este PIN para logar.`,
    };

    return await sns.publish(params).promise();
  },
};
