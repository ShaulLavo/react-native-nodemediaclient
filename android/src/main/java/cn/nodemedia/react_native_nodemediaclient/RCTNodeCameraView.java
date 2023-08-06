//
//  RCTNodeCameraView.java
//
//  Created by Mingliang Chen on 2017/11/29.
//  Copyright © 2017年 NodeMedia. All rights reserved.
//

package cn.nodemedia.react_native_nodemediaclient;

import android.util.Log;
import android.view.Choreographer;
import android.view.View;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.reflect.Field;

import com.google.gson.Gson;
import android.graphics.Bitmap;

import cn.nodemedia.NodeCameraView;
import cn.nodemedia.NodePublisher;
import cn.nodemedia.NodePublisherDelegate;

import java.io.ByteArrayOutputStream;


public class RCTNodeCameraView extends NodeCameraView implements LifecycleEventListener {
    private NodePublisher mNodePublisher;
    private Boolean isAutoPreview = true;

    private int cameraId = -1;
    private boolean cameraFrontMirror = true;

    private int audioBitrate = 32000;
    private int audioProfile = 0;
    private int audioSamplerate = 44100;

    private int videoPreset = NodePublisher.VIDEO_PPRESET_4X3_480;
    private int videoFPS = 20;
    private int videoBitrate = 400000;
    private int videoProfile = NodePublisher.VIDEO_PROFILE_BASELINE;
    private boolean videoFrontMirror = false;

    private boolean denoise = false;
    private boolean dynamicRateEnable = true;
    private int smoothSkinLevel = 0;
    private float zoomScale = 0;


    public RCTNodeCameraView(@NonNull ThemedReactContext context) {
        super(context);
        setupLayoutHack();
        context.addLifecycleEventListener(this);

        mNodePublisher = new NodePublisher(context, RCTNodeMediaClient.getLicense());
        mNodePublisher.setNodePublisherDelegate(new NodePublisherDelegate() {
            @Override
            public void onEventCallback(NodePublisher nodePublisher, int i, String s) {
                WritableMap event = Arguments.createMap();
                event.putInt("code", i);
                event.putString("msg", s);
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        "topChange",
                        event);
            }
        });

    }

    public void takePhoto() { // Remove the fileName parameter
        Log.d("RCTNodeCameraView", "TakePhoto");
        if (mNodePublisher != null) {
            Log.d("RCTNodeCameraView", "TakePhoto2");
            mNodePublisher.capturePicture(new NodePublisher.CapturePictureListener() {
                @Override
                public void onCaptureCallback(Bitmap picture) {
                    try {
                        Log.d("RCTNodeCameraView", "onSuccess triggered.");

                        // Convert bitmap to base64 string
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        picture.compress(Bitmap.CompressFormat.PNG, 100, baos);
                        byte[] byteArray = baos.toByteArray();
                        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        Log.d("RCTNodeCameraView", "Bitmap successfully converted to Base64.");

                        // Send this encoded string to React Native via bridge
                        WritableMap params = Arguments.createMap();
                        params.putString("imageData", encoded);
                        ReactContext reactContext = (ReactContext) getContext();
                        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                                getId(),
                                "onPictureReceived",
                                params);
                        Log.d("RCTNodeCameraView", "Base64 string sent to React Native via bridge.");
                    } catch (Exception e) {
                        Log.e("RCTNodeCameraView", "Error in onCaptureCallback: ", e);
                    }
                }
            });
        }
    }


    public void setOutputUrl(String url) {
        mNodePublisher.setOutputUrl(url);
    }

    public void setCryptoKey(String cryptoKey) {
        mNodePublisher.setCryptoKey(cryptoKey);
    }

    public void setCamera(int cameraId, boolean cameraFrontMirror) {
        this.cameraId = cameraId;
        this.cameraFrontMirror = cameraFrontMirror;
        mNodePublisher.setCameraPreview(this, cameraId, cameraFrontMirror);
        if(isAutoPreview) {
            this.startPrev();
        }
    }

    public void setAudio(int audioBitrate, int audioProfile,int audioSamplerate) {
        mNodePublisher.setAudioParam(audioBitrate, audioProfile, audioSamplerate);
    }

    public void setVideo(int videoPreset, int videoFPS, int videoBitrate, int videoProfile, boolean videoFrontMirror ) {
        mNodePublisher.setVideoParam(videoPreset, videoFPS, videoBitrate, videoProfile, videoFrontMirror);
    }

    public void setDenoise(boolean denoise) {
        this.denoise = denoise;
    }

    public void setDynamicRateEnable(boolean dynamicRateEnable) {
        this.dynamicRateEnable = dynamicRateEnable;
        mNodePublisher.setDynamicRateEnable(dynamicRateEnable);
    }

    public void setSmoothSkinLevel(int smoothSkinLevel) {
        this.smoothSkinLevel = smoothSkinLevel;
    }

    public void setZoomScale(float zoomScale) {
        mNodePublisher.setZoom(zoomScale);
        this.zoomScale = zoomScale;
    }

    public int startPrev() {
        int result = mNodePublisher.startPreview();
        return result;
    }

    public int stopPrev() {
        isAutoPreview = false;
        return mNodePublisher.stopPreview();
    }

    public int start() {
        return mNodePublisher.start();
    }

    public void stop() {
        mNodePublisher.stop();
    }

    public int switchCam() {
        return mNodePublisher.switchCamera();
    }

    public void audioPreview() {
        isAutoPreview = true;
        if(cameraId >=0) {
            this.startPrev();
        }
    }


    public void printFields(Object obj) {
    Class<?> objClass = obj.getClass();
    Field[] fields = objClass.getDeclaredFields();
    for (Field field : fields) {
        field.setAccessible(true); // You might need this if fields are private
        Object value;
        try {
            value = field.get(obj);
        } catch (IllegalAccessException e) {
            value = e.getMessage();
        }
        Log.d("Reflection", "Field: " + field.getName() + ", Value: " + value);
    }
}

    public void doStuff() {
        Log.d("RCTNodeCameraView", "doStuff");
        String result = mNodePublisher.toString(); // Make sure mNodePublisher is defined in this class
        
        // Create a WritableMap to contain the result
        WritableMap map = Arguments.createMap();
        map.putString("result", result);
        printFields(mNodePublisher);

        // Emit an event with the result
        ((ReactContext) getContext()).getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("doStuffEvent", map);
    }


    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        mNodePublisher.stopPreview();
        mNodePublisher.stop();
    }

    void setupLayoutHack() {
        Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
            @Override
            public void doFrame(long frameTimeNanos) {
                manuallyLayoutChildren();
                getViewTreeObserver().dispatchOnGlobalLayout();
                Choreographer.getInstance().postFrameCallback(this);
            }
        });
    }

    void manuallyLayoutChildren() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
    }


}
