// @ts-ignore
import createState from './react-copy-write';
import { FileSystem } from 'expo';
import { Dimensions } from 'react-native';

const screen = Dimensions.get('screen');

export interface PhotoDay {
  date: string;
  uri: string;
}

export interface ProjectPhotos {
  // Key should be of shape 'YYYY-MM-DD'
  [key: string]: PhotoDay;
}

export interface AlignmentGuidePositions {
  center: number;
  eyes: number;
  mouth: number;
}

export interface Project {
  title: string;
  photosTaken: number;
  lastPhoto?: PhotoDay;
  photos: ProjectPhotos;
  alignmentGuides: AlignmentGuidePositions;
}

export const projectUtilities = {
  folderPath(projectName: string) {
    return FileSystem.documentDirectory + encodeURIComponent(projectName) + '/';
  },
  createNewProject: (): Project => ({
    title: '',
    photosTaken: 0,
    photos: {},
    alignmentGuides: {
      center: screen.width * 0.5,
      eyes: screen.height * 0.3,
      mouth: screen.height * 0.6,
    },
  }),
};

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
      projectUtilities.folderPath(project.title),
      { intermediates: true }
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
  saveAlignmentGuidePositions({
    project,
    alignmentGuidePositions,
  }: {
    project: Project;
    alignmentGuidePositions: AlignmentGuidePositions;
  }) {
    mutate((draft: ApplicationState) => {
      const foundProject = selectors.getProject(project.title)(draft);

      foundProject.alignmentGuides = alignmentGuidePositions;
    });
  },
};
