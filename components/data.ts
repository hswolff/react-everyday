// @ts-ignore
import createState from './react-copy-write';
import { FileSystem } from 'expo';

export interface PhotoDay {
  date: string;
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

const projectUtilities = {
  folderPath(projectName: string) {
    return FileSystem.documentDirectory + encodeURIComponent(projectName) + '/';
  },
};

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
  getProject(projectName: string): (state: ApplicationState) => Project {
    return createSelector((state: ApplicationState) =>
      state.projects.find(p => p.title === projectName)
    );
  },
};

export const mutators = {
  async addProject(project: Project) {
    mutate((draft: ApplicationState) => {
      draft.projects.push(project);
    });
    await FileSystem.makeDirectoryAsync(
      projectUtilities.folderPath(project.title)
    );
  },
  deleteProject(projectName: string) {
    mutate((draft: ApplicationState) => {
      draft.projects = draft.projects.filter(
        proj => proj.title !== projectName
      );
    });
  },
  async savePhoto({
    projectName,
    dateKey,
    photoUri,
  }: {
    projectName: string;
    dateKey: string;
    photoUri: string;
  }) {
    const filePath =
      projectUtilities.folderPath(projectName) + dateKey + '.jpg';

    await FileSystem.copyAsync({ from: photoUri, to: filePath });

    mutate((draft: ApplicationState) => {
      const project = selectors.getProject(projectName)(draft);

      project.photos[dateKey] = {
        date: dateKey,
        uri: filePath!,
      };
    });
  },
};
