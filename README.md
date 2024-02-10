# MixMax90
MixMax is a web application directly linked to Spotify, capable of generating diverse playlists based on your favorite artists.

This project was originally created by [Joshua Carter](https://github.com/joshuajcarter/mixmax90); [Deddar](https://github.com/vertig0matrix) and I collaborated through paired programming to refactor this project.

## The Challenge
When we began working on the app, it was still in its initial stage. Several key functionalities were yet to be completed, and the code itself required additional structuring and organization.

## The Changes
- Through this process, we introduced a service file to centralize API requests, enhancing organization.
- Multiple components were created to improve the overall structure and navigation of the website.
- TypeScript was adopted throughout the project to enhance code quality and maintainability.
- Tests were diligently created for these components to ensure robustness and reliability.

## Technologies

[React](https://react.dev/)
[Vite.js](https://vitejs.dev/)
[Vitest](https://vitest.dev/)
[Express.js](https://expressjs.com/)
[Node.js](https://nodejs.org/en)
[MongoDB](https://www.mongodb.com/)
[Mongoose](https://mongoosejs.com/)
[TypeScript](https://www.typescriptlang.org/)
[Jest.js](https://jestjs.io/)

## Get Started
1. Clone the repository
```
git clone git@github.com:andreeeeh/mixmax90.git
```

2. Install dependencies
From client-Fat-Cow folder
```
npm install
```
From server-Fat-Cow folder
```
npm install
```

3. Configure your environment
Edit client/.env && insert your API key and client secret from [Spotify for Developers](https://developer.spotify.com/documentation/web-api)
```
cp client/.env.example client/.env
```
Edit server/.env && insert your instance of MongoDB (local or cloud)
```
cp server/.env.example server/.env
```

4. Run the project
From the root folder

Starts the client
```
npm run dev:client
```
Starts the server
```
npm run dev:server
```