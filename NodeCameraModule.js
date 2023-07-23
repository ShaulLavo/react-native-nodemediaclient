import React from "react";
import {
  UIManager,
  findNodeHandle,
  requireNativeComponent
} from "react-native";

const NodeCameraView = (props, ref) => {
  const videoRef = React.useRef();
  const _onChange = (event) => {
    if (!props.onStatus) {
      return;
    }
    props.onStatus(event.nativeEvent.code, event.nativeEvent.msg);
  };
  const trust = () => {
    console.log('findNodeHandle(videoRef.current)', findNodeHandle(videoRef.current));
    console.log('Commands', UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands);
  };
  const get = () => {
    let a, b;
    if (videoRef.current)
      a = UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        b = UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.get,
        null
      );
    console.log('a', a);
    console.log('b', b);
  };
  const switchCamera = () => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.switchCamera,
        null
      );
  };

  const flashEnable = (enable) => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.flashEnable,
        [enable]
      );
  };

  const startPreview = () => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.startprev,
        null
      );
  };

  const stopPreview = () => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.stopprev,
        null
      );
  };

  const start = () => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.start,
        null
      );
  };

  const stop = () => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.stop,
        null
      );
  };
  React.useImperativeHandle(
    ref,
    () => ({
      stop,
      start,
      switchCamera,
      flashEnable,
      startPreview,
      stopPreview,
      trust,
      get
    }),
    [switchCamera, stop, start, flashEnable, startPreview, stopPreview, get]
  );

  React.useEffect(() => {
    return () => {
      stop();
      console.log("stopping camera on unmount");
    };
  }, []);

  return <RCTNodeCamera {...props} ref={videoRef} onChange={_onChange} />;
};

const RCTNodeCamera = requireNativeComponent("RCTNodeCamera");

module.exports = React.forwardRef(NodeCameraView);
