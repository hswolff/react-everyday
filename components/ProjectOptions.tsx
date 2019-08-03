import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Project } from './types';
import { mutators, Consumer, selectors } from './data';
import { NavigationScreenProps } from 'react-navigation';
import { RouteParams, RouteConfig } from './Router';

const modalWidth = Dimensions.get('screen').width / 2;

export default function ProjectOptions(props: NavigationScreenProps) {
  const [state, setState] = useState({
    visible: false,
  });

  const toggleModal = () => setState(state => ({ visible: !state.visible }));

  const onDelete = () => {
    const projectName: string = props.navigation.getParam(
      RouteParams.ProjectName,
      'Details'
    );
    toggleModal();
    mutators.deleteProject(projectName);
    props.navigation.goBack();
  };

  const projectName = props.navigation.getParam(RouteParams.ProjectName);

  return (
    <Consumer select={[selectors.getProject(projectName)]}>
      {(project: Project) => (
        <View>
          <TouchableOpacity
            style={{ paddingHorizontal: 15 }}
            onPress={toggleModal}
          >
            <FontAwesome name="cog" size={26} color="black" />
          </TouchableOpacity>
          <Modal
            visible={state.visible}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleModal}
          >
            <TouchableWithoutFeedback onPress={toggleModal}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalTextContainer}
                    onPress={onDelete}
                  >
                    <Text style={styles.modalText}>Delete</Text>
                  </TouchableOpacity>
                  <View style={styles.modalTextDivider} />
                  <TouchableOpacity
                    style={styles.modalTextContainer}
                    onPress={() => {
                      props.navigation.navigate(RouteConfig.CameraScreen, {
                        [RouteParams.ProjectName]: props.navigation.getParam(
                          RouteParams.ProjectName
                        ),
                        [RouteParams.Project]: project,
                        [RouteParams.SetAlignmentGuides]: true,
                      });
                      toggleModal();
                    }}
                  >
                    <Text style={styles.modalText}>Set Alignment Guides</Text>
                  </TouchableOpacity>
                  <View style={styles.modalTextDivider} />
                  <TouchableOpacity
                    style={styles.modalTextContainer}
                    onPress={() => {
                      props.navigation.navigate(RouteConfig.CameraScreen, {
                        [RouteParams.ProjectName]: props.navigation.getParam(
                          RouteParams.ProjectName
                        ),
                        [RouteParams.Project]: project,
                        [RouteParams.SetAlignmentGuides]: true,
                      });
                      toggleModal();
                    }}
                  >
                    <Text style={styles.modalText}>Reminders</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
    </Consumer>
  );
}

const borderColor = '#a9aeb3';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#eff3f6',
    borderColor,
    borderWidth: 1,
    borderRadius: 4,
    width: modalWidth,
  },
  modalTextDivider: {
    borderBottomWidth: 1,
    borderColor,
  },
  modalTextContainer: {
    paddingVertical: 15,
  },
  modalText: {
    textAlign: 'center',
    fontWeight: '800',
    color: '#24292e',
  },
});
