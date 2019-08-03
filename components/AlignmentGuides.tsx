import React, { useState, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { AlignmentGuidePositions } from './types';

const USE_NATIVE_DRIVER = false;

const screen = Dimensions.get('screen');

interface GuideCoordinates {
  x: number;
  y: number;
}

interface AlignmentGuideProps {
  horizontal?: boolean;
  vertical?: boolean;
  defaultX?: number;
  defaultY?: number;
  movable: boolean;
  onChange: (e: GuideCoordinates) => void;
}

function AlignmentGuide({
  horizontal = false,
  vertical = false,
  defaultX = 0,
  defaultY = 0,
  movable = false,
  onChange,
}: AlignmentGuideProps) {
  const translateX = useRef(new Animated.Value(defaultX));
  const translateY = useRef(new Animated.Value(defaultY));

  const lastOffset = useRef({ x: defaultX, y: defaultY });

  const onGestureEvent = useRef(
    Animated.event(
      [
        {
          nativeEvent: {
            translationX: translateX.current,
            translationY: translateY.current,
          },
        },
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
    )
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (!event.nativeEvent.oldState) {
      translateX.current.setOffset(lastOffset.current.x);
      translateY.current.setOffset(lastOffset.current.y);
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.current.x += event.nativeEvent.translationX;
      lastOffset.current.y += event.nativeEvent.translationY;

      translateX.current.setOffset(lastOffset.current.x);
      translateX.current.setValue(0);
      translateY.current.setOffset(lastOffset.current.y);
      translateY.current.setValue(0);
    }
    if (event.nativeEvent.state === State.END) {
      if (horizontal === false) {
        translateX.current.setOffset(0);
        translateX.current.setValue(0);
        lastOffset.current.x = 0;
      }
      if (vertical === false) {
        translateY.current.setOffset(0);
        translateY.current.setValue(0);
        lastOffset.current.y = 0;
      }

      onChange({
        // @ts-ignore
        x: translateX.current.toJSON(),
        // @ts-ignore
        y: translateY.current.toJSON(),
      });
    }
  };

  const animatedView = (
    <Animated.View
      hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      style={[
        styles.box,
        {
          width: vertical ? screen.width : 1,
          height: horizontal ? screen.height : 1,
          transform: [
            horizontal && { translateX: translateX.current },
            vertical && { translateY: translateY.current },
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
      onGestureEvent={onGestureEvent.current}
      onHandlerStateChange={onHandlerStateChange}
    >
      {animatedView}
    </PanGestureHandler>
  );
}

interface AlignmentGuidesProps extends AlignmentGuidePositions {
  movable: boolean;
  onChange?: (e: AlignmentGuidePositions) => void;
}
export default function AlignmentGuides({
  movable = false,
  onChange = () => {},
  center,
  eyes,
  mouth,
}: AlignmentGuidesProps) {
  const [state, setState] = useState<AlignmentGuidePositions>({
    center: center,
    eyes: eyes,
    mouth: mouth,
  });

  const createOnChangeHandler = (key: keyof AlignmentGuidePositions) => (
    event: GuideCoordinates
  ) => {
    const nextState: AlignmentGuidePositions = { ...state };

    nextState[key] = event[key === 'center' ? 'x' : 'y'];

    setState(nextState);
    onChange(nextState);
  };

  return (
    <View style={styles.scrollView}>
      <AlignmentGuide
        horizontal
        onChange={createOnChangeHandler('center')}
        movable={movable}
        defaultX={center}
      />
      <AlignmentGuide
        vertical
        onChange={createOnChangeHandler('eyes')}
        movable={movable}
        defaultY={eyes}
      />
      <AlignmentGuide
        vertical
        onChange={createOnChangeHandler('mouth')}
        movable={movable}
        defaultY={mouth}
      />
    </View>
  );
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
