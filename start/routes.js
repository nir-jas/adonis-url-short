'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('home.index')
Route.on('/login').render('home.index')

Route.group(() => {
	Route.post('/custom_link/check_availability','UrlController.customLinkAvailabilityCheck').validator(['CustomLinkAvailability'])
}).prefix('api').namespace('Api/V1')

