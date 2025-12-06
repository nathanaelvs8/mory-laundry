const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = 'Data sudah ada dalam database';
    }

    // MySQL foreign key error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Data referensi tidak ditemukan';
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };
