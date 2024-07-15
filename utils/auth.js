const { verify} = require('jsonwebtoken')



const validateJSONToken = token => {
    return verify(token, 'your-secret-key');
}

exports.validateJSONToken = validateJSONToken