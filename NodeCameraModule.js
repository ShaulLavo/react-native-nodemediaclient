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

  takePhotoAndCache = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoRef.current),
      UIManager.getViewManagerConfig('RCTNodeCamera')?.Commands?.takePhotoAndCache,
      null,
    );
  };

  useEffect(() => {
    console.log('Adding listener for onPictureReceived');

    const handleOnPictureReceived = (event) => {
      console.log('Image path:', event.imagePath); // Updated to imagePath
      if (props.onPictureReceived) {
        props.onPictureReceived(event.imagePath); // Updated to imagePath
      } else {
        console.log('No onPictureReceived callback defined');
      }
    };

    const listener = DeviceEventEmitter.addListener('onPictureReceived', handleOnPictureReceived);

    return () => {
      console.log('Removing listener for onPictureReceived');
      listener.remove();
    };
  }, []);


  takePhotoThroughBridge = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(videoRef.current),
      UIManager.getViewManagerConfig('RCTNodeCamera')?.Commands?.takePhotoThroughBridge,
      null,
    );
  };

  useEffect(() => {
    console.log('Adding listener for onPictureReceived');

    const handleOnPictureReceived = (event) => {
      console.log('Image data:', event.imageData);
      if (props.onPictureReceived) {
        props.onPictureReceived(event.imageData);
      } else {
        console.log('No onPictureReceived callback defined');
      }
    };

    const listener = DeviceEventEmitter.addListener('onPictureReceived', handleOnPictureReceived);

    return () => {
      console.log('Removing listener for onPictureReceived');
      listener.remove();
    };
  }, []);

  useEffect(() => {
    console.log('Adding listener for doStuffEvent');

    const handleDoStuffEvent = (event) => {
      console.log('doStuffEvent received', event);
      console.log('Result from doStuff:', event.result);
    };

    const listener = DeviceEventEmitter.addListener('doStuffEvent', handleDoStuffEvent);

    return () => {
      console.log('Removing listener for doStuffEvent');
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
      takePhotoThroughBridge
    }),
    [switchCamera, stop, start, flashEnable, startPreview, stopPreview, get, doStuff, takePhotoThroughBridge]
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