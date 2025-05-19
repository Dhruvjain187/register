export class ExpressError extends Error {
    constructor(msg, status) {
        super();
        this.msg = msg;
        this.status = status
    }
}