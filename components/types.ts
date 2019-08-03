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

export enum FlashMode {
  off = 'off',
  on = 'on',
  auto = 'auto',
  torch = 'torch',
}

export interface CameraSettings {
  type: string;
  flashMode: FlashMode;
  showGrid: boolean;
}

export interface Project {
  title: string;
  photosTaken: number;
  lastPhoto?: PhotoDay;
  photos: ProjectPhotos;
  alignmentGuides: AlignmentGuidePositions;
  cameraSettings: CameraSettings;
}
