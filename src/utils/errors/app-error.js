class Apperror extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode; // Ensure statusCode is properly set
    }
}

module.exports = Apperror;
