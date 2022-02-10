const userModel = require('../models/users');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const showApi = require('../helpers/showApi');
const { APP_SECRET } = process.env;

exports.login = async(req, res) => {
    const { email, password } = req.body;
    const result = await userModel.getDataUserEmailAsync(email, null);
    // console.log(result);
    if (result.length == 1) {
        const { password: hashPassword } = result[0];
        const checkPassword = await argon.verify(hashPassword, password);
        if (checkPassword) {
            const data = { id: result[0].id };
            const token = jwt.sign(data, APP_SECRET);
            return showApi.showResponse(res, "Login Success!", { token });
        } else {
            return showApi.showResponse(res, "Wrong email or password!", null, 400);
        }
    } else {
        return showApi.showResponse(res, "Wrong email and password!", null, 400);
    }
};

// exports.verify = (req, res) => {
//     const auth = req.headers.authorization;
//     if (auth.startsWith("Bearer")) {
//         const token = auth.split(' ')[1];
//         if (token) {
//             try {
//                 if (jwt.verify(token, APP_SECRET)) {
//                     return showApi.showResponse(res, 'User Verified');
//                 } else {
//                     return showApi.showResponse('User not verified!', null, 403);
//                 }
//             } catch (err) {
//                 return showApi.showResponse('User not verified!', null, 403);
//             }
//         }
//     }
// };