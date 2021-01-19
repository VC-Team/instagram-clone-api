const serverHelper = {};

serverHelper.constance = {
    DEFAULT_PREPARE_HANDLER: (req, res, next) => [req, res, next]
}

serverHelper.pipe = (
    prepareHandler, // (req, res, next) => []
    processHandler, // (...args) => any
    formatOptions = {} // { end, transformBeforeEnd, ... }  
) => {
    return async (req, res, next) => {
        try {
            if (res.headersSent) return;

            const { end, transformBeforeEnd } = formatOptions;

            const params = await prepareHandler(req, res, next);
            const result = await processHandler(...params);

            if (end) {
                let responseData = result;
                if (transformBeforeEnd) {
                    responseData = await transformBeforeEnd(responseData);
                }

                serverHelper.successResponse(res, responseData);
            }

            return result;
        } catch (err) {
            console.log("[ERROR] ", err);
            serverHelper.errorCommonResponse(res);
        }
    }
}

serverHelper.combineMiddlewareSync = (...middlewares) => {
    return async (req, res, next) => {
        const resultObject = {};
        for (let index = 0; index < middlewares.length; index++) {
            if (res.headersSent) return;

            const middleware = middlewares[index];
            const { handler, applyResultKey } = middleware;

            let result = await handler(req, res, next);

            if (applyResultKey) {
                resultObject[applyResultKey] = result;
            } else {
                Object.assign(resultObject, result);
            }
        }

        next();
        return resultObject;
    }
}

serverHelper.combineMiddlewareAsync = (...middlewares) => {
    return async (req, res, next) => {
        const promises = [], resultObject = {};
        for (let index = 0; index < middlewares.length; index++) {
            const middleware = middlewares[index];
            const { handler, applyResultKey } = middleware;

            const result = handler(req, res, next);
            if (result instanceof Promise) {
                result.then((r) => {
                    if (applyResultKey) {
                        return resultObject[applyResultKey] = r;
                    }

                    Object.assign(resultObject, r);
                })

                promises.push(result);
                continue;
            }

            if (applyResultKey) {
                resultObject[applyResultKey] = result;
            } else {
                Object.assign(resultObject, result);
            }
        }

        if (promises.length > 0) {
            await Promise.all(promises);
        }

        return resultObject;
    }
}

serverHelper.combineActions = (...actionObjects) => {

}

serverHelper.combineHandleActions = (...args) => {

}

serverHelper.successResponse = (res, data) => {
    res.status(200).json({
        success: true,
        data: data
    })
}

serverHelper.errorCommonResponse = (res, error = "Something Error", statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        error: error && error.toString()
    });
}

serverHelper.notFoundResponse = (res) => {
    res.status(404).json({
        success: false,
        error: "Not Found"
    });
}

module.exports = serverHelper;