import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { Project } from './data';

interface Props extends NavigationScreenProps {}
interface State extends Project {}

export default class AddProjectScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      title: 'Create Project',
    };
  };

  state = { title: '' };

  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>
          <Text style={styles.title}>Create a Project</Text>
          <TextInput
            style={styles.inputTitle}
            placeholder="Set Title"
            onChangeText={title => this.setState({ title })}
          />
        </View>
        <View style={styles.footer}>
          <FooterButton
            onPress={() => this.props.navigation.goBack()}
            title="Dismiss"
            type="cancel"
          />
          <FooterButton
            onPress={() => this.props.navigation.goBack()}
            title="Create"
            type="confirm"
          />
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
    height: 200,
  },
});

interface FooterButtonProps {
  title: string;
  onPress: () => void;
  type: 'cancel' | 'confirm';
}
function FooterButton({ title, onPress, type }: FooterButtonProps) {
  return (
    <TouchableHighlight
      style={[
        footerButtonStyle.root,
        type === 'cancel' ? footerButtonStyle.cancel : null,
      ]}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </TouchableHighlight>
  );
}

const footerButtonStyle = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  cancel: {
    backgroundColor: 'red',
  },
});
