# Spotistatus

A simple server application for broadcasting the name of the music being played on Spotify to vk.com status.

## Installation and use

1. Clone this repository and install dependencies

    ```
    npm i
    ```
2. Create a `.env` file and write the values into it:
    - **SPOTIFY_ACCESS_TOKEN**
    - **SPOTIFY_REFRESH_TOKEN**
    - **VK_TOKEN**
    - **SPOTIFY_CLIENT_ID**
3. Run the application with the command
    ```
    node app.js
    ```