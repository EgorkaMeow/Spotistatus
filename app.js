'use strict';

const fs = require('fs');

require('dotenv').config();

const fetch = require('node-fetch');
const FormData = require('form-data');

const SPOTIFY_TOKENS = {
    access: process.env.SPOTIFY_ACCESS_TOKEN,
    refresh: process.env.SPOTIFY_REFRESH_TOKEN,
}

const reAuthSpotify = async () => {
    let ReauthData = new FormData();
    ReauthData.append('grant_type', 'refresh_token');
    ReauthData.append('refresh_token', SPOTIFY_TOKENS.refresh);
    ReauthData.append('client_id', process.env.SPOTIFY_CLIENT_ID);

    let response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: ReauthData,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });
    
    response = await response.json();

    SPOTIFY_TOKENS.access = response.access_token;
    SPOTIFY_TOKENS.refresh = response.refresh_token;

    fs.writeFile('current_access_tokens.json', JSON.stringify(SPOTIFY_TOKENS), (err) => { if (err) throw err; });
}

const fetchFromSpotify = async () => {
    let spoty_data = { is_playing: false };

    let spoty_res = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=ES', {
        headers: {
            'Authorization': 'Bearer ' + SPOTIFY_TOKENS.access, 
            'Content-Type': 'application/json'
        },
    });
    
    if(spoty_res.status == 200){
        spoty_data = await spoty_res.json();
    }
    else if(spoty_res.status == 401){
        await reAuthSpotify();
        spoty_data = await fetchFromSpotify();
    }

    return spoty_data;
}

const checkTrack = async () => {
    let spoty_data = await fetchFromSpotify();
    
    let status = spoty_data.is_playing 
        ? encodeURIComponent('🎼 ' + spoty_data.item.name + ' - ' + spoty_data.item.artists[0].name + ' (Spotify)')
        : '';

    await fetch(`https://api.vk.com/method/status.set?text=${status}&access_token=${process.env.VK_TOKEN}&v=5.131`);

    setTimeout(checkTrack, 5000);
}

checkTrack();
