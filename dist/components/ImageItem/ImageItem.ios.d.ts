/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from "react";
import { ImageSource } from "../../@types";
declare type Props = {
    imageSrc: ImageSource;
    onScrollSwipe: (scrollValue: number) => void;
    onRequestClose: () => void;
    onZoom: (scaled: boolean) => void;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    screenWidth: number;
    screenHeight: number;
};
declare const _default: React.MemoExoticComponent<({ imageSrc, onZoom, onRequestClose, onScrollSwipe, swipeToCloseEnabled, doubleTapToZoomEnabled, screenWidth, screenHeight, }: Props) => JSX.Element>;
export default _default;
