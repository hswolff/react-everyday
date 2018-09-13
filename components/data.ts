export interface PhotoDay {
  date: Date;
  uri: string;
}

export interface ProjectPhotos {
  // Key should be of shape 'YYYY-MM-DD'
  [key: string]: PhotoDay;
}

export interface Project {
  title: string;
  photosTaken: number;
  lastPhoto?: PhotoDay;
  photos: ProjectPhotos;
}

export const projectFixtures = [
  {
    title: 'First Year',
    photosTaken: 0,
    photos: {},
  },
  {
    title: 'Green Plant',
    photosTaken: 0,
    photos: {},
  },
];
