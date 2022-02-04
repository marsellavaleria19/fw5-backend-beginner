const userModel = require('../models/users');
const validation = require('../helpers/validation');
const showApi = require('../helpers/showApi');

const getUsers = (request, response) => {
    let dataJson = { response: response, message: '' };
    userModel.getDataUsers((results) => {
        dataJson = {...dataJson, message: 'List data user', result: results };
        return showApi.showSuccess(dataJson);
    });
};

const getUser = (request, response) => {
    const { id } = request.params;
    let dataJson = { response: response, message: '' };
    userModel.getDataUser(id, (results) => {
        if (results.length > 0) {
            dataJson = {...dataJson, message: 'Detail user', result: results[0] };
            return showApi.showSuccess(dataJson);
        } else {
            dataJson = { response: response, message: 'Data User not found.', status: 404 };
            return showApi.showError(dataJson);
        }
    });
};

const insertUser = (request, response) => {
    const data = {
        fullName: request.body.fullName,
        nickName: request.body.nickName,
        gender: request.body.gender,
        photo: request.body.photo,
        address: request.body.address,
        birthDate: request.body.birthDate,
        mobileNumber: request.body.mobileNumber,
        email: request.body.email,
        password: request.body.password
    };

    let dataJson = { response: response, message: '' };

    if (validation.validationDataUser(data) == null) {
        userModel.getDataUserEmail(data.email, null, (result) => {
            if (result.length == 0) {
                userModel.insertDataUser(data, (results) => {
                    if (results.affectedRows > 0) {
                        dataJson = {...dataJson, message: 'Data user created successfully.', result: data };
                        return showApi.showSuccess(dataJson);
                    } else {
                        dataJson = {...dataJson, message: 'Data user failed to create.', status: 500 };
                        return showApi.showError(dataJson);
                    }
                });
            } else {
                dataJson = {...dataJson, message: 'Email has already used.', status: 400 };
                return showApi.showError(dataJson);
            }
        });
    } else {
        dataJson = {...dataJson, message: 'Data user was not valid.', status: 400, error: validation.validationDataUser(data) };
        return showApi.showError(dataJson);
    }
};

const updateUser = (request, response) => {
    const { id } = request.params;
    let dataJson = { response: response, message: '' };
    if (id !== ' ') {
        const data = {
            id: parseInt(id),
            fullName: request.body.fullName,
            nickName: request.body.nickName,
            gender: request.body.gender,
            photo: request.body.photo,
            address: request.body.address,
            birthDate: request.body.birthDate,
            mobileNumber: request.body.mobileNumber,
            email: request.body.email,
            password: request.body.password
        };



        userModel.getDataUser(id, (resultDataUser) => {
            if (resultDataUser.length > 0) {
                if (validation.validationDataUser(data) == null) {
                    userModel.getDataUserEmail(data.email, id, (result) => {
                        if (result.length == 0) {
                            userModel.updateDataUser(id, data, (results) => {
                                if (results.affectedRows > 0) {
                                    dataJson = {...dataJson, message: 'Data user updated successfully.', result: data };
                                    return showApi.showSuccess(dataJson);
                                } else {
                                    dataJson = {...dataJson, message: 'Data user failed to update.', status: 500 };
                                    return showApi.showError(dataJson);
                                }
                            });
                        } else {
                            dataJson = {...dataJson, message: 'Email has already used.', status: 400 };
                            return showApi.showError(dataJson);
                        }
                    });
                } else {
                    dataJson = {...dataJson, message: 'Data user was not valid.', status: 400, error: validation.validationDataUser(data) };
                    return showApi.showError(dataJson);
                }
            } else {
                dataJson = {...dataJson, message: 'Data user not found.', status: 404 };
                return showApi.showError(dataJson);
            }
        });

    } else {
        dataJson = {...dataJson, message: 'id must be filled.', status: 400 };
        return showApi.showError(dataJson);
    }

};

const deleteUser = (request, response) => {
    const { id } = request.params;
    let dataJson = { response: response, message: '' };
    if (id !== ' ') {
        userModel.getDataUser(id, (resultDataUser) => {
            if (resultDataUser.length > 0) {
                userModel.deleteDataUser(id, (results) => {
                    if (results.affectedRows > 0) {
                        dataJson = {...dataJson, message: 'Data user deleted successfully.', result: resultDataUser };
                        return showApi.showSuccess(dataJson);
                    } else {
                        dataJson = {...dataJson, message: 'Data user failed to delete.', status: 500 };
                        return showApi.showSuccess(dataJson);
                    }
                });
            } else {
                dataJson = {...dataJson, message: 'Data history not found.', status: 404 };
                return showApi.showError(dataJson);
            }
        });
    } else {
        dataJson = {...dataJson, message: 'id must filled.', status: 400 };
        return showApi.showError(dataJson);
    }
};

module.exports = { getUsers, getUser, insertUser, updateUser, deleteUser };