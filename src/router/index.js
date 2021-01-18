const path = require("path");
const fs = require("fs");
const AuthenticationServices = require("../service/authentication");

const getDefaultRoutePath = function (moduleName) {
    var routeName = moduleName.split(".");
    routeName.splice(-1, 1);
    return routeName.join(".");
}

const init = function (server, prefix = "/") {
    var modules = fs.readdirSync(__dirname);
    const authenticationService = AuthenticationServices.getServices();
    const middleware = authenticationService.middleware;

    for (let index = 0; index < modules.length; index++) {
        var moduleName = modules[index];
        if (moduleName != "index.js" && moduleName.endsWith(".js")) {
            const module = require(path.join(__dirname, moduleName));
            if (typeof module === "object") {
                const { router, config } = module;

                // const routePath = path.join(prefix, getDefaultRoutePath(moduleName));
                const routePath = prefix + '/' + getDefaultRoutePath(moduleName)
                if (!config.noAuth) {
                    server.use(routePath, middleware);
                } else {
                    const noAuthConfig = config.noAuth;
                    for (const subRoute in noAuthConfig) {
                        let methodNoAuth = noAuthConfig[subRoute] || [];
                        const subRoutePath = path.join(routePath, subRoute);
                        if (!Array.isArray(methodNoAuth)) {
                            methodNoAuth = [methodNoAuth];
                        }

                        methodNoAuth = methodNoAuth.map((method) => method.toLowerCase());
                        server.use(subRoutePath, async (req, res, next) => {
                            let method = req.method.toLowerCase();
                            if (methodNoAuth.indexOf(method) !== -1) {
                                return next();
                            }

                            await middleware(req, res, next);
                            next()
                        });
                    }
                }

                server.use(routePath, router)
            }
        }
    }
}

module.exports = {
    init
}