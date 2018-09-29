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
import { mutators, Project, AlignmentGuidePositions } from './data';
import { NavigationScreenProps } from 'react-navigation';
import { Camera, Permissions, CameraObject, PictureResponse } from 'expo';
import { RouteParams } from './Router';
import AlignmentGuides from './AlignmentGuides';

enum UiState {
  AskingForPermissions,
  NoPermissions,
  CapturePhoto,
  ReviewPhoto,
}

const windowDimensions = Dimensions.get('window');
const buttonSize = 48;
const buttonLargeSize = 64;

enum FlashMode {
  off = 'off',
  on = 'on',
  auto = 'auto',
  torch = 'torch',
}
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
  type: string;
  preview?: {
    uri: string;
  };
  capturingPhoto: boolean;
  flashMode: FlashMode;
}

export default class CameraScreen extends React.Component<Props, State> {
  camera?: CameraObject;

  state: State = {
    uiState: UiState.AskingForPermissions,
    type: Camera.Constants.Type.back,
    preview: undefined,
    capturingPhoto: false,
    flashMode: FlashMode.off,
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

    if (project) {
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

  private onAlignmentGuidesChanged = (
    alignmentGuidePositions: AlignmentGuidePositions
  ) => {
    const project: Project = this.props.navigation.getParam(
      RouteParams.Project
    );
    mutators.saveAlignmentGuidePositions({ project, alignmentGuidePositions });
  };

  render() {
    const { uiState, preview, capturingPhoto } = this.state;
    const project: Project = this.props.navigation.getParam(
      RouteParams.Project
    );

    const closeButton = (
      <FontAwesome
        name="close"
        size={buttonSize}
        color="#FFF"
        onPress={() => this.props.navigation.goBack()}
      />
    );

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
              type={this.state.type}
              flashMode={this.state.flashMode}
              ref={(ref: any) => {
                this.camera = ref;
              }}
            >
              <AlignmentGuides
                movable={true}
                center={project.alignmentGuides.center}
                eyes={project.alignmentGuides.eyes}
                mouth={project.alignmentGuides.mouth}
                onChange={this.onAlignmentGuidesChanged}
              />
              <MaterialCommunityIcons
                name={flashIcons[this.state.flashMode]}
                color="white"
                size={38}
                style={{
                  position: 'absolute',
                  top: 60,
                  left: 30,
                }}
                onPress={() => {
                  this.setState({
                    flashMode: flashModeOrder[
                      this.state.flashMode
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
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}
              />
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
                <FontAwesome
                  name="check-circle"
                  size={buttonSize}
                  color="#000"
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
      default:
        return <View />;
    }
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
