import React from "react";
import {
  UIManager,
  findNodeHandle,
  requireNativeComponent,
  DeviceEventEmitter
} from "react-native";
import { useEffect } from "react";
const NodeCameraView = (props, ref) => {
  const videoRef = React.useRef();


  const doStuff = () => {
    if (videoRef.current)
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(videoRef.current),
        UIManager.getViewManagerConfig("RCTNodeCamera")?.Commands?.doStuff,
        null
      );
  };

  useEffect(() => {
    console.log('Adding listener for doStuffEvent'); // Log when adding the listener

    const handleDoStuffEvent = (event) => {
      console.log('doStuffEvent received', event); // Log when the event is received
      console.log('Result from doStuff:', event.result); // Log the result from doStuff
    };

    const listener = DeviceEventEmitter.addListener('doStuffEvent', handleDoStuffEvent);

    return () => {
      console.log('Removing listener for doStuffEvent'); // Log when removing the listener
      listener.remove();
    };
  }, []);

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

  takePhoto = () => {
    const fileName = 'photo.jpg';
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.cameraRef),
      UIManager.getViewManagerConfig('RCTNodeCamera').Commands.takePhoto,
      [fileName],
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
      get,
      doStuff,
      takePhoto
    }),
    [switchCamera, stop, start, flashEnable, startPreview, stopPreview, get, doStuff, takePhoto]
  );

  React.useEffect(() => {
    return () => {
      stop();
      console.log("stopping camera on unmount");
    };
  }, []);
  console.log('props', props);
  return <RCTNodeCamera {...props} ref={videoRef} onChange={_onChange} />;
};

const RCTNodeCamera = requireNativeComponent("RCTNodeCamera");

module.exports = React.forwardRef(NodeCameraView);