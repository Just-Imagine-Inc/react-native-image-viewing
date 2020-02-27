/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import Modal from "./components/Modal/Modal";
import ImageItem from "./components/ImageItem/ImageItem";
import ImageDefaultHeader from "./components/ImageDefaultHeader";
import useAnimatedComponents from "./hooks/useAnimatedComponents";
import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
const DEFAULT_ANIMATION_TYPE = "fade";
const DEFAULT_BG_COLOR = "#000";
const SCREEN = Dimensions.get("screen");
const SWIPE_CLOSE_OFFSET = 75;
function ImageViewing({ images, imageIndex, visible, onRequestClose, onOrientationChange, onImageIndexChange, animationType = DEFAULT_ANIMATION_TYPE, backgroundColor = DEFAULT_BG_COLOR, swipeToCloseEnabled, doubleTapToZoomEnabled, HeaderComponent, FooterComponent }) {
    const imageList = React.createRef();
    const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
    const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
    const [headerTransform, footerTransform, toggleBarsVisible] = useAnimatedComponents();
    const [screenWidth, setScreenWidth] = useState(SCREEN.width);
    const [screenHeight, setScreenHeight] = useState(SCREEN.height);
    const scrollValueY = new Animated.Value(0);
    const [backdropOpacity, setBackdropOpacity] = useState(1);
    const bgOpacity = scrollValueY.interpolate({
        inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
        outputRange: [0.75, 1, 0.75]
    });
    useEffect(() => {
        return () => Dimensions.removeEventListener('change', handleRotate);
    }, []);
    useEffect(() => {
        if (visible === true) {
            Dimensions.addEventListener('change', handleRotate);
        }
        else if (visible === false) {
            Dimensions.removeEventListener('change', handleRotate);
        }
    }, [visible]);
    useEffect(() => {
        onImageIndexChange && onImageIndexChange(currentImageIndex);
    }, [currentImageIndex]);
    const handleRotate = () => {
        setScreenWidth(Dimensions.get('screen').width);
        setScreenHeight(Dimensions.get('screen').height);
        setBackdropOpacity(1);
    };
    const onZoom = useCallback((isScaled) => {
        var _a, _b;
        // @ts-ignore
        (_b = (_a = imageList) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.setNativeProps({ scrollEnabled: !isScaled });
        toggleBarsVisible(!isScaled);
    }, [imageList]);
    const onImageScrollSwipe = (scrollValue) => {
        let absScrollValue = Math.abs(scrollValue);
        if (absScrollValue > 0 && backdropOpacity === 1) {
            setBackdropOpacity(0);
        }
        else if (absScrollValue === 0 && backdropOpacity === 0) {
            setBackdropOpacity(1);
        }
        scrollValueY.setValue(scrollValue);
    };
    return (<Modal style={{ margin: 0 }} propagateSwipe useNativeDriver hardwareAccelerated hideModalContentWhileAnimating hasBackdrop backdropColor='black' backdropOpacity={backdropOpacity} isVisible={visible === true} animationIn='fadeIn' animationOut='fadeOut' onModalWillHide={onRequestCloseEnhanced} supportedOrientations={["portrait", "landscape"]}>
      <Animated.View style={[styles.scrim, {
            opacity: bgOpacity,
            backgroundColor
        }]}/>
      <View style={[styles.container, { opacity }]}>
        <Animated.View style={[styles.header, { transform: headerTransform }]}>
          {typeof HeaderComponent !== "undefined" ? (React.createElement(HeaderComponent, {
        imageIndex: currentImageIndex
    })) : (<ImageDefaultHeader onRequestClose={onRequestCloseEnhanced}/>)}
        </Animated.View>
        
            <ImageItem screenWidth={screenWidth} screenHeight={screenHeight} onZoom={onZoom} imageSrc={images[0]} //imageSrc}
     onScrollSwipe={onImageScrollSwipe} onRequestClose={onRequestCloseEnhanced} swipeToCloseEnabled={swipeToCloseEnabled} doubleTapToZoomEnabled={doubleTapToZoomEnabled}/>
          
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
const EnhancedImageViewing = (props) => (<ImageViewing key={props.imageIndex} {...props}/>);
export default EnhancedImageViewing;
