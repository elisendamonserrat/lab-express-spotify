require('dotenv').config();

const express = require('express');

const hbs = require('hbs');

const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  const artist = req.query.search;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artistArray = data.body.artists.items;
      console.log('The received data from the API: ', artistArray);
      res.render('artist-search-results', { artistArray, artist });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId, { limit: 10 })
    .then(data => {
      const artistName = data.body.items[0].artists[0].name;
      const albumsArray = data.body.items;
      res.render("albums", { albumsArray, artistName })
    })
    .catch(err => console.log('The error while searching artists albums occurred: ', err));
});

app.get("/view-tracks/:albumsId", (req, res) => {
  const albumsId = req.params.albumsId;

  spotifyApi
  .getAlbumTracks(albumsId, { limit : 5, offset : 1 })
  .then(data => {
    const tracksArray = data.body.items;
    res.render("tracks", { tracksArray })
  })
  .catch(err => console.log('The error while searching albums songs occurred: ', err))

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
