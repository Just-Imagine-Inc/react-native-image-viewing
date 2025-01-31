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
  screenWidth: number,
  screenHeight: number,
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onScrollSwipe: (scrollValue: number) => void;
  onZoom: (isZoomed: boolean) => void;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

declare const _default: React.MemoExoticComponent<({
  screenWidth,
  screenHeight,
  imageSrc,
  onZoom,
  onRequestClose,
  onScrollSwipe,
  swipeToCloseEnabled
}: Props) => JSX.Element>;

export default _default;
