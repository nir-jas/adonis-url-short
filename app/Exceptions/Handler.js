"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");
const Logger = use("Logger")

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
	/**
	 * Handle exception thrown during the HTTP lifecycle
	 *
	 * @method handle
	 *
	 * @param  {Object} error
	 * @param  {Object} options.request
	 * @param  {Object} options.response
	 *
	 * @return {void}
	 */
	async handle(error, { request, response, view }) {
		if (request.url().startsWith('/api')) {
			let message = error.message;

			if (error.code == 'E_ROUTE_NOT_FOUND') message = "Route not found";

			response.jsend(null, message, error.status)
			return
		}
		response.send(view.render("errors.index", { code: error.status, message: error.message }));
		return;
	}

	/**
	 * Report exception for logging or debugging.
	 *
	 * @method report
	 *
	 * @param  {Object} error
	 * @param  {Object} options.request
	 *
	 * @return {void}
	 */
	async report(error, { request }) {
		Logger.info("Request \n", {
			url: request.url,
			headers: request.headers(),
			params: request.all()
		})
		Logger.error(`${error.code} \n`, error)
	}
}

module.exports = ExceptionHandler;
