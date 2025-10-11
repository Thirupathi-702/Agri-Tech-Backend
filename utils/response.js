exports.sendResponse = (res, statusCode, success, message, data = {}, requestId = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            requestId: requestId || res.locals.requestId || null
        }
    });
};


exports.successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            requestId: res.locals.requestId || null
        }
    });
};

exports.errorResponse = (res, message, error = {}, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: {
            code: statusCode,
            details: error.message || error
        },
        meta: {
            timestamp: new Date().toISOString(),
            requestId: res.locals.requestId || null
        }
    });
};
