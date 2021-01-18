const serverHelper = {}

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

module.exports = serverHelper