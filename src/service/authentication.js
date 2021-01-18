const jwt = require("jsonwebtoken");
const { inherits } = require("util");

const { getById } = require("../controller/user");

let services;
let SConfig = Symbol("CONFIG");

const CONSTANT = {
    error: {
        TOKEN_EMPTY: "TOKEN_EMPTY",
        USER_NOT_EXIST: "USER_NOT_EXIST"
    }
}

const AuthenticationError = function (type, message) {
    this.type = type;
    this.message = message;
}

inherits(AuthenticationError, Error);

const Authentication = function ({
    secretKey = "vcworkspace2020",
    algorithm = "HS256",
    tokenHeaderField = "token",
    onError,
    invalidTokenMessage = "token is invalid",
    tokenEmptyErrorMessage = "token is required",
    userNotExistErrorMessage = "user not exist"

} = {}) {

    this[SConfig] = {
        secretKey,
        algorithm,
        tokenHeaderField,
        onError,
        invalidTokenMessage,
        tokenEmpty: tokenEmptyErrorMessage,
        userNotExist: userNotExistErrorMessage
    }
}

Authentication.prototype.sign = async function (payload = {}, option = {}) {
    const config = this[SConfig];
    return await jwt.sign(payload, config.secretKey, option)
}

Authentication.prototype.verify = async function (token, option) {
    const config = this[SConfig];
    return await jwt.verify(token, config.secretKey, option);
}

Authentication.prototype.handleError = function (type) {
    const { onError, tokenEmpty, userNotExist } = services[SConfig];

    let message = "";
    switch (type) {
        case CONSTANT.error.TOKEN_EMPTY:
            message = tokenEmpty;
            break;
        case CONSTANT.error.USER_NOT_EXIST:
            message = userNotExist;
            break;
        default:
            break;
    }
    const error = new AuthenticationError(type, message);

    return error;
}

Authentication.prototype.middleware = async function (req, res, next) {
    const { tokenHeaderField, onError, invalidTokenMessage, tokenEmpty } = services[SConfig];
    const token = req.headers[tokenHeaderField];
    
    if (!token) {
        const error = services.handleError(CONSTANT.error.TOKEN_EMPTY);
        if (typeof onError === "function") {
            onError(error, req, res, next);
        }

        return next(error);
    }

    await services.verify(token)
        .then(async (decoded) => {
            const [user] = await getById(decoded._id);
            if (!user) {
                const error = services.handleError(CONSTANT.error.USER_NOT_EXIST);
                if (typeof onError === "function") {
                    onError(error, req, res, next);
                }

                return next(error);
            }
            req.user = user
            next()
        })
        .catch(_error => {
            const error = new Error(invalidTokenMessage);
            if (onError) {
                onError(error)
            }
            return next(error);
        })
}

const initService = (config = {}) => {
    if (services) return services;

    return services = new Authentication(config);
}

module.exports = {
    getServices: () => services,
    initService
}
