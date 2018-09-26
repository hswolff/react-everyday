import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { mutators, Consumer, selectors, Project } from './data';
import { NavigationScreenProps } from 'react-navigation';
import { RouteParams } from './Router';

const modalWidth = Dimensions.get('screen').width / 2;

interface Props extends NavigationScreenProps {}
interface State {
  visible: boolean;
}

export default class ProjectOptions extends React.Component<Props, State> {
  state: State = {
    visible: false,
  };

  private toggleModal = () =>
    this.setState(state => ({ visible: !state.visible }));

  private onDelete = () => {
    const projectName: string = this.props.navigation.getParam(
      RouteParams.ProjectName,
      'Details'
    );
    this.toggleModal();
    mutators.deleteProject(projectName);
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          style={{ paddingHorizontal: 15 }}
          onPress={this.toggleModal}
        >
          <FontAwesome name="cog" size={26} color="black" />
        </TouchableOpacity>
        <Modal
          visible={this.state.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={this.toggleModal}
        >
          <TouchableWithoutFeedback onPress={this.toggleModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalTextContainer}
                  onPress={this.onDelete}
                >
                  <Text style={styles.modalText}>Delete</Text>
                </TouchableOpacity>
                {/* <View style={styles.modalTextDivider} />
                <TouchableOpacity style={styles.modalTextContainer} >
                  <Text style={styles.modalText}>Rename</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
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
