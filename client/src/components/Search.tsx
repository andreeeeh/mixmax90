// TODO implement spotify login feature
// TODO fix search icon functionality
// TODO fix heart icon functionality

import { useState } from "react";
import { searchForArtist, getTopTracks, addTopTracksToDB, getRelatedArtistData } from "./apiServices.js";
import SearchBar from "../searchComponents/SearchBar.tsx"
import SearchList from "../searchComponents/SearchList.tsx"
import TopTracks from "../searchComponents/TopTracks.tsx";
import { ArtistResponseObject } from "../Interfaces/artist.interface.ts"
import { Track, TracksResponse, TracksWrapper } from "../Interfaces/track.interface.ts";


interface SearchProps {
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

interface ArtistList {
  artists: {
    items: []
  }
}

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
  const [searchResult, setSearchResult] = useState<[]>([]);
  const [artistId, setArtistId] = useState<string>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [showTopTracks, setShowTopTracks] = useState<boolean>(false);
  const [heartColor, setHeartColor] = useState<string>("#eee");


  async function handleSearch(): Promise<void> {
    let artistName: string = search.replace(/\s+/g, "+");
    const artistList: ArtistList = await searchForArtist(artistName)
    setSearchResult(artistList.artists.items)
    setSearch("");
  }

  async function handleRelatedArtistData(id: string): Promise<void> {

    setArtistId(id);

    const artistData: ArtistResponseObject = await getRelatedArtistData(id);

    const artistIds: string[] = getArtistIds(artistData);

    const tracks: TracksResponse = await getTopTracks(artistIds);

    const randomTracks: Track[] = getRandomTracksByArtist(tracks);

    setTopTracks(randomTracks);
    addTopTracksToDB(randomTracks)
    setHeartColor("#eee");
  };

  const getArtistIds = (data: ArtistResponseObject) => {
    const artistIds: string[] = [];
    data.artists.forEach(artist => artistIds.push(artist.id));
    return artistIds;
  };

  function getRandomTracksByArtist(tracks: TracksResponse): Track[] {
    const uniqueArtists = new Set<string>();
    const result: Track[] = [];

    
    tracks.forEach((album) => {
      album.tracks.forEach((track) => {
        const artistId: string = track.artists[0].id;

        // Add the artist ID to the set of unique artists
        uniqueArtists.add(artistId);

        // Randomly select a track for the artist
        const randomIndex: number = Math.floor(Math.random() * album.tracks.length);
        const randomTrack: Track = album.tracks[randomIndex];
        // console.log("result", randomTrack);

        // Add the random track to the result array
        if (!(result.includes(randomTrack))) {
          result.push(randomTrack);
        }
      });
    });
    return result.slice(0, 31);
  };

  const heartClick = (): void => {

    // Update the color to red when clicked
    setHeartColor("red");
    // Your additional onClick logic goes here
    console.log("Heart clicked! 6");
  };


  return (
    <div>
      <SearchBar
        search={search}
        handleSearch={handleSearch}
        setSearch={setSearch}
      />

      <SearchList
        searchResult={searchResult}
        setTopTracks={setTopTracks}
        handleRelatedArtistData={handleRelatedArtistData}
        setSearchResult={setSearchResult}
        setShowTopTracks={setShowTopTracks}
      />

      <TopTracks
        showTopTracks={showTopTracks}
        heartColor={heartColor}
        heartClick={heartClick}
        setTopTracks={setTopTracks}
        handleRelatedArtistData={handleRelatedArtistData}
        setSearchResult={setSearchResult}
        setShowTopTracks={setShowTopTracks}
        topTracks={topTracks}
        artistId={artistId}
      />

    </div>
  );
};

export default Search;
