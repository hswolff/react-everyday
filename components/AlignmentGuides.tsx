import React from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { AlignmentGuidePositions } from './data';

const USE_NATIVE_DRIVER = false;

const screen = Dimensions.get('screen');

interface GuideCoordinates {
  x: number;
  y: number;
}

export class AlignmentGuide extends React.Component<{
  horizontal: boolean;
  vertical: boolean;
  defaultX: number;
  defaultY: number;
  movable: boolean;
  onChange: (e: GuideCoordinates) => void;
}> {
  static defaultProps = {
    horizontal: false,
    vertical: false,
    defaultX: 0,
    defaultY: 0,
    movable: false,
  };

  private translateX = new Animated.Value(this.props.defaultX);
  private translateY = new Animated.Value(this.props.defaultY);

  private lastOffset = { x: this.props.defaultX, y: this.props.defaultY };

  private onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: this.translateX,
          translationY: this.translateY,
        },
      },
    ],
    { useNativeDriver: USE_NATIVE_DRIVER }
  );

  private onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (!event.nativeEvent.oldState) {
      this.translateX.setOffset(this.lastOffset.x);
      this.translateY.setOffset(this.lastOffset.y);
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastOffset.x += event.nativeEvent.translationX;
      this.lastOffset.y += event.nativeEvent.translationY;

      this.translateX.setOffset(this.lastOffset.x);
      this.translateX.setValue(0);
      this.translateY.setOffset(this.lastOffset.y);
      this.translateY.setValue(0);
    }
    if (event.nativeEvent.state === State.END) {
      if (this.props.horizontal === false) {
        this.translateX.setOffset(0);
        this.translateX.setValue(0);
        this.lastOffset.x = 0;
      }
      if (this.props.vertical === false) {
        this.translateY.setOffset(0);
        this.translateY.setValue(0);
        this.lastOffset.y = 0;
      }

      this.props.onChange({
        // @ts-ignore
        x: this.translateX.toJSON(),
        // @ts-ignore
        y: this.translateY.toJSON(),
      });
    }
  };

  render() {
    const { horizontal, vertical, movable } = this.props;

    const animatedView = (
      <Animated.View
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        style={[
          styles.box,
          {
            width: this.props.vertical ? screen.width : 1,
            height: this.props.horizontal ? screen.height : 1,
            transform: [
              horizontal && { translateX: this.translateX },
              vertical && { translateY: this.translateY },
            ].filter(Boolean),
          },
        ]}
      />
    );

    if (!movable) {
      return animatedView;
    }

    return (
      <PanGestureHandler
        onGestureEvent={this.onGestureEvent}
        onHandlerStateChange={this.onHandlerStateChange}
      >
        {animatedView}
      </PanGestureHandler>
    );
  }
}

interface AlignmentGuidesProps extends AlignmentGuidePositions {
  movable: boolean;
  onChange: (e: AlignmentGuidePositions) => void;
}
export default class AlignmentGuides extends React.Component<
  AlignmentGuidesProps
> {
  static defaultProps = {
    movable: false,
    onChange: () => {},
  };

  state: AlignmentGuidePositions = {
    center: this.props.center,
    eyes: this.props.eyes,
    mouth: this.props.mouth,
  };

  private createOnChangeHandler = (key: keyof AlignmentGuidePositions) => (
    event: GuideCoordinates
  ) => {
    const nextState: AlignmentGuidePositions = { ...this.state };

    nextState[key] = event[key === 'center' ? 'x' : 'y'];

    this.setState(nextState, () => this.props.onChange(this.state));
  };

  render() {
    return (
      <View style={styles.scrollView}>
        <AlignmentGuide
          horizontal
          onChange={this.createOnChangeHandler('center')}
          movable={this.props.movable}
          defaultX={this.props.center}
        />
        <AlignmentGuide
          vertical
          onChange={this.createOnChangeHandler('eyes')}
          movable={this.props.movable}
          defaultY={this.props.eyes}
        />
        <AlignmentGuide
          vertical
          onChange={this.createOnChangeHandler('mouth')}
          movable={this.props.movable}
          defaultY={this.props.mouth}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  box: {
    backgroundColor: 'white',
    zIndex: 200,
    position: 'absolute',
  },
});
