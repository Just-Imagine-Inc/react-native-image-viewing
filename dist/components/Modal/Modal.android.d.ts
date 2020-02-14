/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
declare type Props = {
    visible: boolean;
    transparent: boolean;
    children: JSX.Element;
    onRequestClose: () => void;
};
declare const Modal: ({ visible, children, onRequestClose }: Props) => JSX.Element;
export default Modal;
