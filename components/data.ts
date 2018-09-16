// @ts-ignore
import createState from './react-copy-write';

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

export interface ApplicationState {
  projects: Array<Project>;
}

export const { Provider, Consumer, createSelector, mutate } = createState();

export const initialState: ApplicationState = {
  projects: [],
};

export const selectors = {
  projects: createSelector((state: ApplicationState) => state.projects),
};

export const mutators = {
  addProject(project: Project) {
    mutate((draft: ApplicationState) => {
      draft.projects.push(project);
    });
  },
  deleteProject(projectName: string) {
    mutate((draft: ApplicationState) => {
      draft.projects = draft.projects.filter(
        proj => proj.title !== projectName
      );
    });
  },
};
