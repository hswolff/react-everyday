import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { Project } from './data';

const halfWindow = Dimensions.get('window').width / 2;
const iconSize = {
  width: halfWindow * 0.55,
  height: halfWindow * 0.75,
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
          <FooterButton
            onPress={() => this.props.navigation.goBack()}
            type="cancel"
          />
          <FooterButton onPress={this.onCreate} type="confirm" />
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
});

interface FooterButtonProps {
  onPress: () => void;
  type: 'cancel' | 'confirm';
}
function FooterButton({ onPress, type }: FooterButtonProps) {
  let rootStyle;
  let icon = 'plus-circle';
  if (type === 'cancel') {
    rootStyle = footerButtonStyle.cancel;
    icon = 'times-circle';
  }

  return (
    <TouchableHighlight
      style={[footerButtonStyle.root, rootStyle]}
      onPress={onPress}
    >
      <FontAwesome name={icon} size={iconSize.width} color="white" />
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
