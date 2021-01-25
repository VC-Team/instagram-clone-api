const config = require("./src/config");

const serverHelper = require("./src/helper/server");

const ServerAPI = require("./src/server");
const MongoService = require("./src/service/mongo");

const { initService: initAuthenticationService } = require("./src/service/authentication");

const start = async (rootConfig) => {
    const { api: apiConfig = {}, database: databaseConfig = {}, socket: socketConfig = {}, storage: storageConfig } = rootConfig;

    await MongoService.connect(databaseConfig.mongo);

    initAuthenticationService({
        ...apiConfig.authentication,
        onError: (error, req, res) => {
            const { type, message } = error;
            if (type === "TOKEN_EMPTY") {
                serverHelper.errorCommonResponse(res, message, 401);
            }

            if (type === "USER_NOT_EXIST") {
                serverHelper.errorCommonResponse(res, message, 404);
            }
        }
    })

    ServerAPI.start(apiConfig);
}

start(config)