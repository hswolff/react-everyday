import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Project } from './data';

interface Props extends Project {
  onPress: (title: string) => void;
  separators: {
    highlight: () => void;
    unhighlight: () => void;
  };
}

export default class ProjectListItem extends React.Component<Props> {
  render() {
    const { separators, title, lastPhoto } = this.props;
    return (
      <TouchableHighlight
        style={styles.root}
        underlayColor="#CCC"
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        onPress={() => this.props.onPress(title)}
      >
        <>
          <View style={styles.left}>
            <Text>{title}</Text>
            <Text>{lastPhoto != null && lastPhoto.date.toLocaleString()}</Text>
          </View>
          <View style={styles.right}>
            {lastPhoto == null ? (
              <FontAwesome
                name="user-o"
                color="#000"
                style={styles.rightEmpty}
              />
            ) : (
              <Image
                style={styles.rightImage}
                source={{
                  uri:
                    'https://facebook.github.io/react-native/docs/assets/favicon.png',
                }}
              />
            )}
          </View>
        </>
      </TouchableHighlight>
    );
  }
}

const verticalPadding = 20;

const styles = StyleSheet.create({
  root: {
    paddingVertical: verticalPadding,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  rightEmpty: {
    fontSize: 40,
    width: 35,
    height: 40,
  },
  rightImage: {
    marginTop: -verticalPadding,
    marginBottom: -verticalPadding,
    width: 50,
    height: 50,
  },
});
