# URL Short

URL Short is a URL shortener web application based on the AdonisJS Framework. It is an open-source, easy-to-use but powerful URL shortener. It allows you to host your own URL shortener, and gives you many useful features.

> **Warning: URL Short is still in development**, constantly being optimized and isn't still stable enough to be used in production environments.

## Features

* URL Shortener
* Customized short URL's(ex: example.com/adonis)
* QR code generator
* Simple Interface
* User & Admin Dashboard

## Screenshots

![Home](https://imgur.com/HYD0hC2.png)
![Stats](https://imgur.com/VKhcxNg.png)
![Login](https://imgur.com/xCNA0zm.png)
![Dashboard](https://imgur.com/OuR4YVw.png)

## Prerequisites

* Node.js >= 8.0.0
* npm >= 3.0.0
* MySQL or MariaDB
* adonis-cli (optional)

## Getting Started

### Via Cloning The Repository

```bash
# if you don't have AdonisJS CLI
npm i -g @adonisjs/cli

# Change directory
cd adonis-url

# Install Dependencies
npm install

# Copy .env.example to .env and update it to your specific needs. Don't forget to set DB_USERNAME and DB_PASSWORD with the settings used behind.
cp .env.example .env

# Run migrations
adonis migration:run

# Seed Database
adonis seed

# Serve
adonis serve --dev
```

## Login Details

   | Email             | Name | Password | Role       |
   |-------------------|----------|----------|--------------|
   | admin@test.com | Admin    | admin@123    | Administrator |
   | user@test.com  | User     | user@123    | User  |

## Compiling assets

1. `npm install`
2. `npm run dev` or `npm run production`

    *You can watch assets with `npm run watch`*

## License

URL Short is an open-source software licensed under the [MIT license](https://github.com/nir-jas/adonis-url/blob/master/LICENSE).
