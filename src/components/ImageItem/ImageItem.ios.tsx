/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback, useRef, useState, useEffect } from "react";

import {
  Animated,
  Dimensions,
  ScrollView,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableWithoutFeedback
} from "react-native";
import FastImage from "react-native-fast-image";

import useDoubleTapToZoom from "../../hooks/useDoubleTapToZoom";
import useImageDimensions from "../../hooks/useImageDimensions";

import { getImageStyles, getImageTransform } from "../../utils";
import { ImageSource } from "../../@types";
import { ImageLoading } from "./ImageLoading";

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

const SWIPE_CLOSE_VELOCITY = 1.55;
const SWIPE_CLOSE_DISTANCE = 100;

type Props = {
  imageSrc: ImageSource;
  onScrollSwipe: (scrollValue: number) => void;
  onRequestClose: () => void;
  onZoom: (scaled: boolean) => void;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  screenWidth: number
  screenHeight: number
};

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  onScrollSwipe,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
  screenWidth,
  screenHeight,
}: Props) => {
  const screen = Dimensions.get("screen");
  const scrollViewRef = useRef<ScrollView>(null);
  const [loaded, setLoaded] = useState(false);
  const [scaled, setScaled] = useState(false);
  const imageDimensions = useImageDimensions(imageSrc);
  const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, screen);
  const [translate, scale] = getImageTransform(imageDimensions, screen);
  const scaleValue = new Animated.Value(scale || 1);
  const translateValue = new Animated.ValueXY(translate);
  const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;

  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );

  const zoomOut = useCallback(() => {
    const scrollResponderRef = scrollViewRef?.current?.getScrollResponder();
    // @ts-ignore
    scrollResponderRef?.scrollResponderZoomTo({
      x: 0,
      y: 0,
      width: screenWidth,
      height: screenHeight,
      animated: true
    })
  }, [screenWidth])

  useEffect(() => {
    // zoom out on rotate
    if(scaled) {
      zoomOut()
    }
  }, [screenWidth])

  const onScrollEndDrag = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const velocityY = nativeEvent?.velocity?.y ?? 0;
      const distance = nativeEvent?.contentOffset?.y ?? 0;
      const scaled = nativeEvent?.zoomScale > 1;

      onZoom(scaled);
      setScaled(scaled);

      if(
        !scaled && swipeToCloseEnabled &&
        (
          Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY ||
          Math.abs(distance) > SWIPE_CLOSE_DISTANCE
        )
      ) {
        onRequestClose();
      }
    },
    [scaled]
  );

  const onScroll = ({
    nativeEvent
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (nativeEvent?.zoomScale > 1) {
      return;
    }

    onScrollSwipe(offsetY)
  };

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        style={{
          width: screenWidth,
          height: screenHeight,
        }}
        pinchGestureEnabled
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={maxScale}
        contentContainerStyle={{
          height: screenHeight
        }}

        scrollEnabled={swipeToCloseEnabled}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
        {...(swipeToCloseEnabled && {
          onScroll
        })}
      >
        {(!loaded || !imageDimensions) && <ImageLoading />}
        <TouchableWithoutFeedback
          onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined}
        >
          <AnimatedFastImage
            source={imageSrc}
            style={imagesStyles}
            onLoad={() => setLoaded(true)}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default React.memo(ImageItem);
