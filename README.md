# MixMax90
MixMax is a web application directly linked to Spotify, capable of generating diverse playlists based on your favorite artists.

This project was originally created by Joshua; Deddar and I collaborated through paired programming to refactor this project.

# The Challenge
When we began working on the app, it was still in its initial stage. Several key functionalities were yet to be completed, and the code itself required additional structuring and organization.

# The Changes
- Through this process, we introduced a service file to centralize API requests, enhancing organization.
- Multiple components were created to improve the overall structure and navigation of the website.
- TypeScript was adopted throughout the project to enhance code quality and maintainability.
- Tests were diligently created for these components to ensure robustness and reliability.

# How To Run
To run locally you will need the following:

You will need access to an instance of MongoDB, either locally or cloud hosted. Place the URI to your database in ./server/.env following the format from .env.example.

You will also need a Spotify account to use this app. Get an API key and client secret from Spotify for Developers. Place these keys in ./client-ts/.env, following the example formatting from .env.example.

In ./server & ./client-ts run npm i. In ./server run npm run dev, and also in ./client-ts.