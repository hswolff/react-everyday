import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { Project } from './data';

const halfWindow = Dimensions.get('window').width / 2;
const iconSize = {
  width: halfWindow * 0.45,
  height: halfWindow * 0.65,
};

interface Props extends NavigationScreenProps {}
interface State extends Project {}

export default class AddProjectScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      title: 'Create Project',
    };
  };

  state = { title: '', photosTaken: 0, photos: {} };

  private onCreate = () => {
    alert('Project Created');
    this.props.navigation.goBack();
  };

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>
          <FontAwesome
            name="road"
            size={halfWindow}
            color="#000"
            style={{ alignSelf: 'center' }}
          />
          <Text style={styles.title}>Create Project</Text>
          <TextInput
            style={styles.inputTitle}
            placeholder="Title"
            onChangeText={title => this.setState({ title })}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.footerButtonLabel}>Cancel</Text>
            <FontAwesome
              name="times-circle"
              size={iconSize.width}
              color="red"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={this.onCreate}>
            <Text style={styles.footerButtonLabel}>Create</Text>
            <FontAwesome
              name="plus-circle"
              size={iconSize.width}
              color="green"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputTitle: {
    height: 40,
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    height: iconSize.height,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
