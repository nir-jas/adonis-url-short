const { hooks } = require("@adonisjs/ignitor");
const _ = use('lodash')
const moment = require('moment')
const numeral = require('numeral');

hooks.after.providersBooted(() => {
	const Response = use("Adonis/Src/Response");
	const Validator = use("Validator");
	const Database = use("Database");
	const View = use("View");
	const Config = use("Config");

	Response.macro("jsend", function(data = null, message = null, code = 200, status = "success") {
		if (code >= 200 && code < 300) {
			status = "success";
		} else if (code >= 400 && code < 500) {
			status = "fail";
		} else if (code >= 500) {
			status = "error";
		}

		return this.status(code).json({
			status: status,
			message: message,
			data: data
		});
	});

	Validator.extend("exists", async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			/**
			 * skip validation if value is not defined. `required` rule
			 * should take care of it.
			 */
			return;
		}

		const [table, column] = args;
		const row = await Database.table(table)
			.where(column, value)
			.first();

		if (!row) {
			throw message;
		}
	});

	Validator.extend("isUUID", async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			/**
			 * skip validation if value is not defined. `required` rule
			 * should take care of it.
			 */
			return;
		}
		if (!value.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
			// throw "Invalid " + field;
			throw message;
		}
	});

	Validator.extend("lowercase", async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			/**
			 * skip validation if value is not defined. `required` rule
			 * should take care of it.
			 */
			return;
		}
		if (value != value.toLowerCase()) {
			// throw "Invalid " + field;
			throw message;
		}
	});

	View.global("config", function(key) {
		return Config.get(key);
	});

	View.global("getDayTimeString",function(d) {
		return moment(d).format("ddd, MMM Do YYYY, h:mm A")
	})

	View.global("getFromNowString",function(d) {
		return moment(d).format("ddd, MMM Do YYYY, h:mm A").fromNow()
	})

	View.global('numeral',function(value,format) {
		return numeral(value).format(format)
	})
});

hooks.after.httpServer(()=>{
	const Validator = use("Validator");
	const Route = use('Route');
	const RegisteredRoutes = _.map(Route.list(),(route)=>{
		return route._route;
	})

	Validator.extend("routeAvailability", async (data, field, message, args, get) => {
		const value = get(data, field);
		if (!value) {
			/**
			 * skip validation if value is not defined. `required` rule
			 * should take care of it.
			 */
			return;
		}
		if (RegisteredRoutes.includes(value) || RegisteredRoutes.includes(`/${value}`)) {
			// throw "Invalid " + field;
			throw message;
		}
	});
})
