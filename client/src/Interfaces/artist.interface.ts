export interface Artist {
    external_urls: {
        spotify: string;
    };
    followers: {
        href: null | string;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
};


export interface ArtistResponseObject {
    artists: [
        artists: Artist
    ]
};