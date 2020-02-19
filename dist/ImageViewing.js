/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, View, VirtualizedList } from "react-native";
import Modal from "./components/Modal/Modal";
import ImageItem from "./components/ImageItem/ImageItem";
import ImageDefaultHeader from "./components/ImageDefaultHeader";
import useAnimatedComponents from "./hooks/useAnimatedComponents";
import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
const DEFAULT_ANIMATION_TYPE = "fade";
const DEFAULT_BG_COLOR = "#000";
const SCREEN = Dimensions.get("screen");
function ImageViewing({ images, imageIndex, visible, onRequestClose, onOrientationChange, onImageIndexChange, animationType = DEFAULT_ANIMATION_TYPE, backgroundColor = DEFAULT_BG_COLOR, swipeToCloseEnabled, doubleTapToZoomEnabled, HeaderComponent, FooterComponent }) {
    const imageList = React.createRef();
    const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
    const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
    const [headerTransform, footerTransform, toggleBarsVisible] = useAnimatedComponents();
    const [screenWidth, setScreenWidth] = useState(SCREEN.width);
    const [screenHeight, setScreenHeight] = useState(SCREEN.height);
    const handleRotate = () => {
        setScreenWidth(Dimensions.get('screen').width);
        setScreenHeight(Dimensions.get('screen').height);
    };
    useEffect(() => {
        Dimensions.addEventListener('change', handleRotate);
        return () => Dimensions.removeEventListener('change', handleRotate);
    }, []);
    useEffect(() => {
        if (onImageIndexChange) {
            onImageIndexChange(currentImageIndex);
        }
    }, [currentImageIndex]);
    const onZoom = useCallback((isScaled) => {
        var _a, _b;
        // @ts-ignore
        (_b = (_a = imageList) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.setNativeProps({ scrollEnabled: !isScaled });
        toggleBarsVisible(!isScaled);
    }, [imageList]);
    return (<Modal style={{ margin: 0 }} propagateSwipe useNativeDriver hideModalContentWhileAnimating scrollOffset={1} isVisible={visible} animationIn='fadeIn' animationOut='fadeOut' onModalWillHide={onRequestCloseEnhanced} supportedOrientations={["portrait", "landscape"]}>
      <View style={[styles.container, { opacity, backgroundColor }]}>
        <Animated.View style={[styles.header, { transform: headerTransform }]}>
          {typeof HeaderComponent !== "undefined" ? (React.createElement(HeaderComponent, {
        imageIndex: currentImageIndex
    })) : (<ImageDefaultHeader onRequestClose={onRequestCloseEnhanced}/>)}
        </Animated.View>
        <VirtualizedList ref={imageList} data={images} horizontal scrollEnabled={images.length > 1} pagingEnabled windowSize={2} initialNumToRender={1} maxToRenderPerBatch={1} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} initialScrollIndex={imageIndex} getItem={(_, index) => images[index]} getItemCount={() => images.length} getItemLayout={(_, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index
    })} renderItem={({ item: imageSrc }) => (<ImageItem screenWidth={screenWidth} screenHeight={screenHeight} onZoom={onZoom} imageSrc={imageSrc} onRequestClose={onRequestCloseEnhanced} swipeToCloseEnabled={swipeToCloseEnabled} doubleTapToZoomEnabled={doubleTapToZoomEnabled}/>)} onMomentumScrollEnd={onScroll} keyExtractor={imageSrc => imageSrc.uri}/>
        {typeof FooterComponent !== "undefined" && (<Animated.View style={[styles.footer, { transform: footerTransform }]}>
            {React.createElement(FooterComponent, {
        imageIndex: currentImageIndex
    })}
          </Animated.View>)}
      </View>
    </Modal>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
const EnhancedImageViewing = (props) => (<ImageViewing key={props.imageIndex} {...props}/>);
export default EnhancedImageViewing;
