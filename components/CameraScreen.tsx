import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  mutators,
  Project,
  AlignmentGuidePositions,
  CameraSettings,
  FlashMode,
  Consumer,
  selectors,
} from './data';
import { NavigationScreenProps } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { RouteParams } from './Router';
import AlignmentGuides from './AlignmentGuides';

enum UiState {
  AskingForPermissions,
  NoPermissions,
  SetAlignmentGuides,
  CapturePhoto,
  ReviewPhoto,
}

const windowDimensions = Dimensions.get('window');
const buttonSize = 48;
const buttonLargeSize = 64;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};
const flashIcons = {
  off: 'flash-off',
  on: 'flash',
  auto: 'flash-auto',
  torch: 'flashlight',
};

interface Props extends NavigationScreenProps {}
interface State {
  uiState: UiState;
  preview?: {
    uri: string;
  };
  capturingPhoto: boolean;
  draftAlignmentGuides?: AlignmentGuidePositions;
}

export default class CameraScreen extends React.Component<Props, State> {
  camera?: Camera;

  state: State = {
    uiState: UiState.AskingForPermissions,
    preview: undefined,
    capturingPhoto: false,
    draftAlignmentGuides: undefined,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const uiState =
      status === 'granted' ? UiState.CapturePhoto : UiState.NoPermissions;

    this.setState({
      uiState,
    });

    if (uiState === UiState.NoPermissions) {
      return;
    }

    const project: Project = this.props.navigation.getParam(
      RouteParams.Project
    );
    const dateString = this.props.navigation.getParam(
      RouteParams.CurrentDateString
    );
    const setAlignmentGuides = this.props.navigation.getParam(
      RouteParams.SetAlignmentGuides
    );

    if (project) {
      if (setAlignmentGuides) {
        this.setState({
          uiState: UiState.SetAlignmentGuides,
          draftAlignmentGuides: project.alignmentGuides,
        });
        return;
      }

      const photo = project.photos[dateString];
      if (photo) {
        this.setState({ preview: photo, uiState: UiState.ReviewPhoto });
      }
    }
  }

  takePhoto = async () => {
    if (this.camera) {
      this.setState({ capturingPhoto: true });
      try {
        const photo = await this.camera.takePictureAsync();
        this.setState({ preview: photo, uiState: UiState.ReviewPhoto });
      } catch (error) {
      } finally {
        this.setState({ capturingPhoto: false });
      }
    }
  };

  private redoPhoto = () => {
    this.setState({
      preview: undefined,
      uiState: UiState.CapturePhoto,
    });
  };

  private savePhoto = async () => {
    const photoPreview = this.state.preview;
    if (photoPreview === undefined) {
      this.redoPhoto();
      return;
    }

    const projectName = this.props.navigation.getParam(RouteParams.ProjectName);
    const dateString = this.props.navigation.getParam(
      RouteParams.CurrentDateString
    );
    try {
      await mutators.savePhoto({
        projectName,
        dateKey: dateString,
        photoUri: photoPreview.uri,
      });
    } catch (error) {
      this.redoPhoto();
      return;
    }

    this.props.navigation.goBack();
  };

  private saveCameraSettings = (
    project: Project,
    newSettings: CameraSettings
  ) => {
    mutators.saveCameraSettings({
      project,
      cameraSettings: newSettings,
    });
  };

  render() {
    const { uiState, preview, capturingPhoto } = this.state;
    const projectName: string = this.props.navigation.getParam(
      RouteParams.ProjectName,
      'Details'
    );

    const closeButton = (
      <FontAwesome
        name="close"
        size={buttonSize}
        color="#FFF"
        onPress={() => this.props.navigation.goBack()}
      />
    );

    const topButtons = (project: Project) => (
      <>
        <MaterialCommunityIcons
          name={flashIcons[project.cameraSettings.flashMode]}
          color="white"
          size={38}
          style={{
            position: 'absolute',
            top: 60,
            left: 30,
          }}
          onPress={() => {
            this.saveCameraSettings(project, {
              ...project.cameraSettings,
              flashMode: flashModeOrder[
                project.cameraSettings.flashMode
              ] as FlashMode,
            });
          }}
        />
        <MaterialCommunityIcons
          name="rotate-3d"
          color="white"
          size={38}
          style={{
            position: 'absolute',
            top: 60,
            right: 30,
          }}
          onPress={() => {
            this.saveCameraSettings(project, {
              ...project.cameraSettings,
              type:
                project.cameraSettings.type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back,
            });
          }}
        />
      </>
    );

    return (
      <Consumer select={[selectors.getProject(projectName)]}>
        {(project: Project) => {
          switch (uiState) {
            case UiState.AskingForPermissions:
              return (
                <SafeAreaView style={styles.root}>
                  <ControlBar>
                    <View />
                  </ControlBar>
                </SafeAreaView>
              );
            case UiState.NoPermissions: {
              return (
                <SafeAreaView
                  style={[
                    styles.root,
                    { justifyContent: 'center', alignItems: 'center' },
                  ]}
                >
                  <Text>No access to camera</Text>
                  <ControlBar>{closeButton}</ControlBar>
                </SafeAreaView>
              );
            }
            case UiState.CapturePhoto: {
              return (
                <SafeAreaView style={styles.root}>
                  <Camera
                    style={styles.fullScreen}
                    type={project.cameraSettings.type}
                    flashMode={project.cameraSettings.flashMode}
                    ref={(ref: any) => {
                      this.camera = ref;
                    }}
                  >
                    {project.cameraSettings.showGrid && (
                      <AlignmentGuides
                        movable={false}
                        center={project.alignmentGuides.center}
                        eyes={project.alignmentGuides.eyes}
                        mouth={project.alignmentGuides.mouth}
                      />
                    )}
                    {topButtons(project)}
                    <ControlBar>
                      {closeButton}
                      {capturingPhoto ? (
                        <FontAwesome
                          name="spinner"
                          size={buttonLargeSize}
                          color="#fff"
                          style={styles.centerButton}
                        />
                      ) : (
                        <FontAwesome
                          name="camera"
                          size={buttonLargeSize}
                          color="#FFF"
                          onPress={this.takePhoto}
                          style={styles.centerButton}
                        />
                      )}
                      <MaterialCommunityIcons
                        name={
                          project.cameraSettings.showGrid ? 'grid' : 'grid-off'
                        }
                        color="white"
                        size={buttonSize}
                        onPress={() => {
                          this.saveCameraSettings(project, {
                            ...project.cameraSettings,
                            showGrid: !project.cameraSettings.showGrid,
                          });
                        }}
                      />
                    </ControlBar>
                  </Camera>
                </SafeAreaView>
              );
            }
            case UiState.ReviewPhoto: {
              if (preview) {
                return (
                  <SafeAreaView style={{ flex: 1 }}>
                    <Image
                      style={[styles.fullScreen, styles.picturePreview]}
                      source={{ uri: preview.uri }}
                    />
                    <ControlBar>
                      {closeButton}
                      <FontAwesome
                        name="undo"
                        size={buttonLargeSize}
                        color="#FFF"
                        onPress={this.redoPhoto}
                        style={styles.centerButton}
                      />
                      <FontAwesome
                        name="check-circle"
                        size={buttonSize}
                        color="#FFF"
                        onPress={this.savePhoto}
                      />
                    </ControlBar>
                  </SafeAreaView>
                );
              }
            }
            case UiState.SetAlignmentGuides: {
              if (this.state.draftAlignmentGuides) {
                return (
                  <SafeAreaView style={styles.root}>
                    <Camera
                      style={styles.fullScreen}
                      type={project.cameraSettings.type}
                      flashMode={project.cameraSettings.flashMode}
                      ref={(ref: any) => {
                        this.camera = ref;
                      }}
                    >
                      <AlignmentGuides
                        movable={true}
                        center={this.state.draftAlignmentGuides.center}
                        eyes={this.state.draftAlignmentGuides.eyes}
                        mouth={this.state.draftAlignmentGuides.mouth}
                        onChange={event =>
                          this.setState({
                            draftAlignmentGuides: event,
                          })
                        }
                      />
                      {topButtons(project)}
                      <ControlBar>
                        {closeButton}
                        <Text style={{ color: 'white' }}>
                          Set Alignment Guides
                        </Text>
                        <FontAwesome
                          name="check-circle"
                          size={buttonSize}
                          color="#FFF"
                          onPress={() => {
                            mutators.saveAlignmentGuidePositions({
                              project,
                              alignmentGuidePositions: this.state
                                .draftAlignmentGuides!,
                            });
                            this.props.navigation.goBack();
                          }}
                        />
                      </ControlBar>
                    </Camera>
                  </SafeAreaView>
                );
              }
            }
            default:
              return <View />;
          }
        }}
      </Consumer>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fullScreen: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  picturePreview: {
    resizeMode: 'contain',
  },
  centerButton: {},
});

interface ControlBarProps {
  children: Array<React.ReactChild> | React.ReactChild;
}
const ControlBar = ({ children }: ControlBarProps) => (
  <View
    style={{
      backgroundColor: 'black',
      position: 'absolute',
      paddingBottom: 50,
      bottom: 0,
      left: 0,
      width: windowDimensions.width,
      height: Math.round(windowDimensions.height * 0.2),
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}
  >
    {children}
  </View>
);
