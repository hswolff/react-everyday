import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { NavigationScreenProps, SafeAreaView } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { mutators, projectUtilities } from './data';

const halfWindow = Dimensions.get('window').width / 2;
const iconSize = {
  width: halfWindow * 0.45,
  height: halfWindow * 0.65,
};

export default function AddProjectScreen(props: NavigationScreenProps) {
  const [state, setState] = useState(projectUtilities.createNewProject);

  const onCreate = async () => {
    if (state.title === '') {
      Alert.alert('Enter a Project name');
      return;
    }
    await mutators.addProject(state);
    props.navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardDismissMode="on-drag"
      >
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
            onChangeText={title => setState(project => ({ ...project, title }))}
            returnKeyType="done"
            onSubmitEditing={onCreate}
            autoFocus
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => props.navigation.goBack()}
          >
            <Text style={styles.footerButtonLabel}>Cancel</Text>
            <FontAwesome
              name="times-circle"
              size={iconSize.width}
              color="red"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={onCreate}>
            <Text style={styles.footerButtonLabel}>Create</Text>
            <FontAwesome
              name="plus-circle"
              size={iconSize.width}
              color="green"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
AddProjectScreen.navigationOptions = () => {
  return {
    title: 'Create Project',
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    justifyContent: 'space-between',
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
