//
//  RCTNodeCameraView.java
//
//  Created by Mingliang Chen on 2017/11/29.
//  Copyright © 2017年 NodeMedia. All rights reserved.
//

package cn.nodemedia.react_native_nodemediaclient;

import java.io.ByteArrayOutputStream;


import android.util.Log;
import android.util.Base64;
import android.view.Choreographer;
import android.view.View;
import android.graphics.Bitmap;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import cn.nodemedia.NodeCameraView;
import cn.nodemedia.NodePublisher;
import cn.nodemedia.NodePublisherDelegate;


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
    

    public void capturePicture() {
    mNodePublisher.capturePicture(new NodePublisher.CapturePictureListener() {
        @Override
        public void onCaptureCallback(Bitmap picture) {
            // Convert Bitmap to Base64
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            picture.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            String base64Picture = Base64.encodeToString(byteArray, Base64.DEFAULT);

            // Emit event to JavaScript
            WritableMap event = Arguments.createMap();
            event.putString("picture", base64Picture);
            mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onPictureCaptured", event);
        }
    });
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

    @Override
    public void onHostResume() {
        // System.out.println("onHostResume");


    }

    @Override
    public void onHostPause() {
        // System.out.println("onHostResume");
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
