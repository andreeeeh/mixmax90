// TODO check the use/necessity of props in Search.jsx  
// TODO create a util file for the functions
// TODO abstract components from html
// TODO implement spotify login feature
// TODO fix search icon functionality
// TODO fix heart icon functionality

import React from "react";
import { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { TbReload } from "react-icons/tb";
import { searchForArtist, getTopTracks, addTopTracksToDB, getRelatedArtistData } from "./apiServices";

const Search = ({ search, setSearch }) => {

  const [searchResult, setSearchResult] = useState([]);
  const [artistId, setArtistId] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [heartColor, setHeartColor] = useState("#eee");


  async function handleSearch () {
    let artistName = search.replace(/\s+/g, "+");
    const data = await searchForArtist(artistName)
    setSearchResult(data.artists.items)
    setSearch("");
  }

  async function handleRelatedArtistData (id) {
    setArtistId(id);
    const artistData = await getRelatedArtistData(id);

    const artistIds = getArtistIds(artistData);
    const tracks = await getTopTracks(artistIds);
    const randomTracks = getRandomTracksByArtist(tracks);

    setTopTracks(randomTracks);
    addTopTracksToDB(randomTracks)
    setHeartColor("#eee");
  };

  const getArtistIds = (data) => {
    const artistIds = [];
    data.artists.forEach(artist => artistIds.push(artist.id));
    return artistIds;
  };

  function getRandomTracksByArtist (tracks) {
    const uniqueArtists = new Set();
    const result = [];

    tracks.forEach((album) => {
      album.tracks.forEach((track) => {
        const artistId = track.artists[0].id;

        // Add the artist ID to the set of unique artists
        uniqueArtists.add(artistId);

        // Randomly select a track for the artist
        const randomIndex = Math.floor(Math.random() * album.tracks.length);
        const randomTrack = album.tracks[randomIndex];

        // Add the random track to the result array
        result.push(randomTrack);

      });
    });

    return result;
  };

  const heartClick = () => {
    // Update the color to red when clicked
    setHeartColor("red");

    // Your additional onClick logic goes here
    console.log("Heart clicked! 6");
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
        <button onClick={handleSearch} type="submit" id="submitButton">
          <BsSearchHeart />
        </button>
      </form>

      <ul className="artist-search-ul">
        {searchResult.map((artist, index) => (
          <li
            className="artist-search-li"
            onClick={() => {
              {
                console.log("in selectArtist.map");
              }
              setTopTracks([]);
              // click creates
              handleRelatedArtistData(artist.id);
              setSearchResult([]);
              setShowTopTracks(true);
            }}
            key={index}
          >
            <div className="artist-search-thumb-container">
              {artist.images[2] && (
                <img
                  className="artist-search-thumb-img"
                  src={artist.images[2].url}
                  alt=""
                />
              )}
            </div>
            <div className="artist-search-name">{artist.name}</div>
            {/* Id: {artist.id} */}
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
                handleRelatedArtistData(artistId);
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
