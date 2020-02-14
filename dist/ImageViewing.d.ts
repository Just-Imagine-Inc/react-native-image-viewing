/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ComponentType } from "react";
import { ImageSource } from "./@types";
declare type Props = {
    images: ImageSource[];
    imageIndex: number;
    visible: boolean;
    onRequestClose: () => void;
    onImageIndexChange?: (imageIndex: number) => void;
    animationType?: "none" | "fade" | "slide";
    backgroundColor?: string;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    HeaderComponent?: ComponentType<{
        imageIndex: number;
    }>;
    FooterComponent?: ComponentType<{
        imageIndex: number;
    }>;
};
declare const EnhancedImageViewing: (props: Props) => JSX.Element;
export default EnhancedImageViewing;
