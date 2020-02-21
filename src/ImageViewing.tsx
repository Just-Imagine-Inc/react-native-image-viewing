/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  VirtualizedList
} from "react-native";

import Modal from "./components/Modal/Modal";
import ImageItem from "./components/ImageItem/ImageItem";
import ImageDefaultHeader from "./components/ImageDefaultHeader";

import useAnimatedComponents from "./hooks/useAnimatedComponents";
import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
import { ImageSource } from "./@types";

type Props = {
  images: ImageSource[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onOrientationChange?: () => void;
  onImageIndexChange?: (imageIndex: number) => void;
  animationType?: "none" | "fade" | "slide";
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  HeaderComponent?: ComponentType<{ imageIndex: number }>;
  FooterComponent?: ComponentType<{ imageIndex: number }>;
};

const DEFAULT_ANIMATION_TYPE = "fade";
const DEFAULT_BG_COLOR = "#000";
const SCREEN = Dimensions.get("screen");

const SWIPE_CLOSE_OFFSET = 75;

function ImageViewing({
  images,
  imageIndex,
  visible,
  onRequestClose,
  onOrientationChange,
  onImageIndexChange,
  animationType = DEFAULT_ANIMATION_TYPE,
  backgroundColor = DEFAULT_BG_COLOR,
  swipeToCloseEnabled,
  doubleTapToZoomEnabled,
  HeaderComponent,
  FooterComponent
}: Props) {
  const imageList = React.createRef<VirtualizedList<ImageSource>>();
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
  const [
    headerTransform,
    footerTransform,
    toggleBarsVisible
  ] = useAnimatedComponents();

  const [screenWidth, setScreenWidth] = useState(SCREEN.width)
  const [screenHeight, setScreenHeight] = useState(SCREEN.height)

  const scrollValueY = new Animated.Value(0)

  const bgOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.75, 1, 0.75]
  });

  useEffect(() => {
    Dimensions.addEventListener('change', handleRotate)
    return () => Dimensions.removeEventListener('change', handleRotate)
  }, [])

  useEffect(() => {
    onImageIndexChange && onImageIndexChange(currentImageIndex)
  }, [currentImageIndex]);

  const handleRotate = () => {
    setScreenWidth(Dimensions.get('screen').width)
    setScreenHeight(Dimensions.get('screen').height)
  }

  const onZoom = useCallback(
    (isScaled: boolean) => {
      // @ts-ignore
      imageList?.current?.setNativeProps({ scrollEnabled: !isScaled });
      toggleBarsVisible(!isScaled);
    },
    [imageList]
  );

  const onImageScrollSwipe = (scrollValue: number) => {
    scrollValueY.setValue(scrollValue)
  }

  return (
    <Modal
      style={{ margin: 0 }}
      propagateSwipe
      useNativeDriver
      hardwareAccelerated
      hideModalContentWhileAnimating
      hasBackdrop
      backdropColor='black'
      backdropOpacity={0}
      isVisible={visible}
      animationIn='fadeIn'
      animationOut='fadeOut'
      onModalWillHide={onRequestCloseEnhanced}
      supportedOrientations={["portrait", "landscape"]}
    >
      <Animated.View
        style={
          [styles.scrim, {
            opacity: bgOpacity,
            backgroundColor
          }]
        }
      />
      <View style={[styles.container, { opacity }]}>
        <Animated.View style={[styles.header, { transform: headerTransform }]}>
          {typeof HeaderComponent !== "undefined" ? (
            React.createElement(HeaderComponent, {
              imageIndex: currentImageIndex
            })
          ) : (
            <ImageDefaultHeader onRequestClose={onRequestCloseEnhanced} />
          )}
        </Animated.View>
        {/* Removing this until we want to support carousel viewing of all images in chat.
        <VirtualizedList
          ref={imageList}
          data={images}
          horizontal
          scrollEnabled={images.length > 1}
          bounces={images.length > 1}
          pagingEnabled
          windowSize={2}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={imageIndex}
          getItem={(_, index) => images[index]}
          getItemCount={() => images.length}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index
          })}
          renderItem={({ item: imageSrc }) => (
        */}
            <ImageItem
              screenWidth={screenWidth}
              screenHeight={screenHeight}
              onZoom={onZoom}
              imageSrc={images[0]}//imageSrc}
              onScrollSwipe={onImageScrollSwipe}
              onRequestClose={onRequestCloseEnhanced}
              swipeToCloseEnabled={swipeToCloseEnabled}
              doubleTapToZoomEnabled={doubleTapToZoomEnabled}
            />
          {/* )}
          onMomentumScrollEnd={onScroll}
          keyExtractor={imageSrc => imageSrc.uri}
        /> */}
        {typeof FooterComponent !== "undefined" && (
          <Animated.View
            style={[styles.footer, { transform: footerTransform }]}
          >
            {React.createElement(FooterComponent, {
              imageIndex: currentImageIndex
            })}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000"
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 0
  },
  footer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    bottom: 0
  }
});

const EnhancedImageViewing = (props: Props) => (
  <ImageViewing key={props.imageIndex} {...props} />
);

export default EnhancedImageViewing;
