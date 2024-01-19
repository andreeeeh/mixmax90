// TODO check the use/necessity of props in Search.jsx  
// TODO create a util file for the functions
// TODO abstract components from html
// TODO implement spotify login feature
// TODO fix search icon functionality

import React from "react";
import { useEffect, useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { TbReload } from "react-icons/tb";

const Search = ({ search, setSearch, currentTracks, setCurrentTracks }) => {

  const [searchResult, setSearchResult] = useState([]);

  const [topTracks, setTopTracks] = useState([]);


  const [artistId, setArtistId] = useState(null);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [heartColor, setHeartColor] = useState("#eee");

  let accessToken = null;

  let artistName = search.replace(/\s+/g, "+");


  const getSpotifyToken = async () => {
    const url = "https://accounts.spotify.com/api/token";
    const client_id = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;

    const token = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
    }).then(res => res.json())

    accessToken = token.access_token;
  };

  // search for artists by name in search box 
  const searchForArtist = async () => {
    await getSpotifyToken();
    const searchUrl = `https://api.spotify.com/v1/search?q=${artistName}&type=artist`;
    await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + `${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSearchResult(() => data.artists.items))
      .catch(error => console.log('error getting artist ID', error))
    setSearch("");

  };

  const getRelatedArtistData = async (clickedArtistId) => {
    setArtistId(clickedArtistId)
    await getSpotifyToken();

    const relatedArtistsUrl = `https://api.spotify.com/v1/artists/${clickedArtistId}/related-artists`;
    const relatedArtistsResponse = await fetch(relatedArtistsUrl, {
      method: "Get",
      headers: {
        Authorization: "Bearer " + `${accessToken}`,
      },
    });



    const relatedArtistData = await relatedArtistsResponse.json();

    const artistIds = getArtistIds(relatedArtistData);
    const tracks = await getTopTracks(artistIds);
    const randomTracks = getRandomTracksByArtist(tracks);
    setTopTracks(randomTracks);
    // save to DB
    addTopTrackstoDB(randomTracks)
    setHeartColor("#eee");
    console.log('getRelatedArtistData running 🌊')
  };





  const getArtistIds = (data) => {
    const artistIds = [];

    if (data && data.artists && Array.isArray(data.artists)) {
      data.artists.forEach((artist) => {
        if (artist.name) {
          artistIds.push(artist.id);
          console.log('getArtistIds running 🦖')
          // artistIds.push({id:artist.id, name:artist.name});
        }
      });
    }

    return artistIds;
  };

  const getTopTracks = async (data) => {
    const topTracks = [];

    await Promise.all(
      data.map(async (id) => {
        const url = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=GB`;
        const response = await fetch(url, {
          method: "Get",
          headers: {
            Authorization: "Bearer " + `${accessToken}`,
          },
        });

        const artistTopTracks = await response.json();
        topTracks.push(artistTopTracks);
      })
    );
    // console.log('TOPTRAX', topTracks)
    return topTracks;
  };

  function getRandomTracksByArtist (tracks) {
    const uniqueArtists = new Set();
    const result = [];

    tracks.forEach((album) => {
      album.tracks.forEach((track) => {
        const artistId = track.artists[0].id;

        // Check if the artist ID is unique
        if (!uniqueArtists.has(artistId)) {
          // Add the artist ID to the set of unique artists
          uniqueArtists.add(artistId);

          // Randomly select a track for the artist
          const randomIndex = Math.floor(Math.random() * album.tracks.length);
          const randomTrack = album.tracks[randomIndex];

          // Add the random track to the result array
          result.push(randomTrack);
        }
      });
    });

    return result;
  };

  async function addTopTrackstoDB (tracks) {
    fetch("http://localhost:3000/toptracks", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tracks),
    });
  };

  const heartClick = () => {
    // Update the color to red when clicked
    setHeartColor("red");

    // Your additional onClick logic goes here
    console.log("Heart clicked!");
  };
  return (
    <div>
      <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          size="50"
          name=""
          id="search"
          role="searchbox"
          placeholder=" Find music like..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchForArtist} type="submit" id="submitButton">
          <BsSearchHeart />
        </button>
      </form>

      <ul className="artist-search-ul">
        {searchResult.map((artist, index) => (
          <li
            className="artist-search-li"
            onClick={() => {
              // setTopTracks([]);
              // click creates
              getRelatedArtistData(artist.id);
              setSearchResult([]);
              setShowTopTracks(true);
            }}
            key={index}
          >
            <div className="artist-search-thumb-container">
              {artist.images[2] && (
                <img className="artist-search-thumb-img" src={artist.images[2].url} />
              )}
            </div>
            <div className="artist-search-name">{artist.name}</div>
          </li>
        ))}
      </ul>

      {showTopTracks && (
        <ul className="top-tracks-ul">
          <div className="top-tracks-ul-title-container">
            <div
              className="top-tracks-ul-title-container-icon"
              onClick={() => {
                {
                  console.log("in reload");
                }
                setTopTracks([]);
                getRelatedArtistData(artistId);
                setSearchResult([]);
                setShowTopTracks(true);
              }}
            >
              <TbReload />
            </div>
            <div className="top-tracks-title">Nice work!</div>
            <div
              className="top-tracks-ul-title-container-icon"
              id="heart"
              style={{ color: heartColor }}
              onClick={heartClick}
            >
              <GoHeart />
            </div>
          </div>
          {topTracks.map((track, index) => (
            <li className="top-tracks-li" key={index}>
              {/* { console.log('TRACK STRUCTURE',track)} */}
              <div className="top-tracks-thumb-container">
                {track.album.images[2] && (
                  <img
                    className="top-tracks-thumb-img"
                    src={track.album.images[2].url}
                    alt=""
                  />
                )}
              </div>
              <div className="track-details">
                <div className="track-details-track">{`${track.name}`}</div>
                <div className="track-details-artist">{`${track.artists[0].name}`}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
