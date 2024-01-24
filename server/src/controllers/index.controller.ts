// TODO implement typescript
// TODO feature: logic to delete saved mixtape
import { RequestHandler, Request, Response } from 'express'
import topTracksModel, { TopTracks } from '../models/topTracksModel.models'
import db from '../index.model'

export async function getPlaylist(req: Request, res: Response): Promise<void> {
  try {
    const newTopTracks = await topTracksModel.find({})
    res.status(200).send(newTopTracks)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export async function savePlaylist(req: Request, res: Response): Promise<void> {
  try {
    const tracks = req.body;
    console.log(tracks)
    await topTracksModel.create({ tracks }) // {tracks:[...]}
    console.log('saved in the db 📩')
    res.status(201).json({ msg: 'tracks added' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

