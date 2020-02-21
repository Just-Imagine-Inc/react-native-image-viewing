/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Animated, Dimensions, ScrollView, View, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import useDoubleTapToZoom from "../../hooks/useDoubleTapToZoom";
import useImageDimensions from "../../hooks/useImageDimensions";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageLoading } from "./ImageLoading";
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const SWIPE_CLOSE_VELOCITY = 1.55;
const SWIPE_CLOSE_DISTANCE = 100;
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onScrollSwipe, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, screenWidth, screenHeight, }) => {
    const screen = Dimensions.get("screen");
    const scrollViewRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [scaled, setScaled] = useState(false);
    const imageDimensions = useImageDimensions(imageSrc);
    const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, screen);
    const [translate, scale] = getImageTransform(imageDimensions, screen);
    const scaleValue = new Animated.Value(scale || 1);
    const translateValue = new Animated.ValueXY(translate);
    const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;
    const imagesStyles = getImageStyles(imageDimensions, translateValue, scaleValue);
    const zoomOut = useCallback(() => {
        var _a, _b, _c;
        const scrollResponderRef = (_b = (_a = scrollViewRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.getScrollResponder();
        // @ts-ignore
        (_c = scrollResponderRef) === null || _c === void 0 ? void 0 : _c.scrollResponderZoomTo({
            x: 0,
            y: 0,
            width: screenWidth,
            height: screenHeight,
            animated: true
        });
    }, [screenWidth]);
    useEffect(() => {
        // zoom out on rotate
        if (scaled) {
            zoomOut();
        }
    }, [screenWidth]);
    const onScrollEndDrag = useCallback(({ nativeEvent }) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const velocityY = (_c = (_b = (_a = nativeEvent) === null || _a === void 0 ? void 0 : _a.velocity) === null || _b === void 0 ? void 0 : _b.y, (_c !== null && _c !== void 0 ? _c : 0));
        const distance = (_f = (_e = (_d = nativeEvent) === null || _d === void 0 ? void 0 : _d.contentOffset) === null || _e === void 0 ? void 0 : _e.y, (_f !== null && _f !== void 0 ? _f : 0));
        const scaled = ((_g = nativeEvent) === null || _g === void 0 ? void 0 : _g.zoomScale) > 1;
        onZoom(scaled);
        setScaled(scaled);
        if (!scaled && swipeToCloseEnabled &&
            (Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY ||
                Math.abs(distance) > SWIPE_CLOSE_DISTANCE)) {
            onRequestClose();
        }
    }, [scaled]);
    const onScroll = ({ nativeEvent }) => {
        var _a, _b, _c, _d;
        const offsetY = (_c = (_b = (_a = nativeEvent) === null || _a === void 0 ? void 0 : _a.contentOffset) === null || _b === void 0 ? void 0 : _b.y, (_c !== null && _c !== void 0 ? _c : 0));
        if (((_d = nativeEvent) === null || _d === void 0 ? void 0 : _d.zoomScale) > 1) {
            return;
        }
        onScrollSwipe(offsetY);
    };
    return (<View>
      <ScrollView ref={scrollViewRef} style={{
        width: screenWidth,
        height: screenHeight,
    }} pinchGestureEnabled nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} maximumZoomScale={maxScale} contentContainerStyle={{
        height: screenHeight,
    }} scrollEnabled={swipeToCloseEnabled} onScrollEndDrag={onScrollEndDrag} scrollEventThrottle={1} {...(swipeToCloseEnabled && {
        onScroll
    })}>
        {(!loaded || !imageDimensions) && <ImageLoading />}
        <TouchableWithoutFeedback onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined}>
          <AnimatedFastImage source={imageSrc} style={imagesStyles} onLoad={() => setLoaded(true)}/>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>);
};
export default React.memo(ImageItem);
