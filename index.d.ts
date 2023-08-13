declare module "react-native-nodemediaclient" {
    import type * as React from "react";
    import { View, ViewProps } from "react-native";

    export interface NodeCameraViewProps extends ViewProps {
        /** @description Reference to the component */
        ref?: (ref: NodeCameraViewType) => any;

        /** @description RTMP stream endpoint */
        outputUrl: string;

        /** @description Camera settings */
        camera?: CameraConfig;

        /** @description Audio settings */
        audio?: AudioConfig;

        /** @description Video settings */
        video?: VideoConfig;

        /** 
         * @description Autostart camera preview
         * @default false 
         */
        autopreview?: boolean;

        /** 
         * @description Enable denoise for improved quality 
         */
        denoise?: boolean;

        /** 
         * @description Auto adjust bitrate 
         */
        dynamicRateEnable?: boolean;

        /** 
         * @description Skin smoothness level 
         * @range 0-5 
         */
        smoothSkinLevel?: number;

        /** 
         * @description Key for stream encryption 
         */
        cryptoKey?: string;

        /** 
         * @description Callback for stream status changes 
         */
        onStatus?(code?: OutputStreamStatus, status?: string): void;

        /** 
         * @description Camera zoom level
         * @range 0.0-1.0 
         */
        zoomScale?: number;

        /** 
         * @description Callback when a picture is taken 
         */
        onPictureReceived?: (data: string) => void;

        /** 
         * @description Is microphone muted?
         * @default false 
         */
        isMuted?: boolean;
    }
    export interface NodeCameraViewType extends View {
        /** 
         * @description Stop the current stream 
         */
        stop(): void;

        /** 
         * @description Begin streaming 
         */
        start(): void;

        /** 
         * @description Switch between front and back camera 
         */
        switchCamera(): void;

        /** 
         * @description Toggle the flash 
         * @param enable If true, flash will be enabled. If false or omitted, it'll be disabled. 
         */
        flashEnable(enable?: boolean): void;

        /** 
         * @description Start showing the camera's view 
         */
        startPreview(): void;

        /** 
         * @description End the camera's preview 
         */
        stopPreview(): void;

        /** 
         * @description Trust the current settings or source (exact functionality to be defined) 
         */
        trust(): void;

        /** 
        * @description Capture a photo and send it through the bridge
         */
        takePhotoThroughBridge(): void;
        /** 
         * @description Capture a photo and save it to cache, then send the location through the bridge
         */
        takePhotoAndCache(): void;


        /** 
         * @description Mute or unmute the microphone 
         */
        toggleMute(): void;

        /** 
         * @description Execute additional functionality (exact details to be defined) 
         */
        doStuff(): void;

        /** 
         * @description Retrieve current settings or status (exact details to be defined) 
         */
        get(): void;
    }

    export interface VideoConfig {
        /**
         * @description Video sizes and Aspect Ratio
         * @requires VideoAspectRatios
         */
        preset?: AR16X9 | AR4X3 | AR1X1;

        /** 
         * @description Defines video stream's byte rate 
         */
        bitrate?: number;

        /** 
         * @description Video quality selection
         */
        profile?: VideoProfiles;

        /** 
         * @description Video frame rate 
         */
        fps?: number;

        /** 
         * @description Should the front camera mirror the preview?
         * @default false
         */
        videoFrontMirror?: boolean;
    }

    export interface AudioConfig {
        /** 
         * @description Defines audio stream's byte rate
         */
        bitrate?: number;

        /** 
         * @description Audio quality selection
         */
        profile?: AudioProfiles;

        /** 
         * @description Audio sample rate 
         * @range 32000 - 48000
         */
        samplerate?: number;
    }

    export interface CameraConfig {
        /** 
         * @description Defines the camera for streaming
         */
        cameraId: CameraId;

        /** 
         * @description Should the front camera mirror the preview?
         * @default false
         */
        cameraFrontMirror: boolean;
    }

    export enum CameraId {
        BackCamera = 0,
        FrontCamera = 1,
    }

    export enum OutputStreamStatus {
        Connecting = 2000,
        Start = 2001,
        Failed = 2002,
        Closed = 2004,
        Congestion = 2100,
        Unobstructed = 2101,
    }
    /** Video sizes for 16x9 aspect ratio
       * @example 1080p is 1920x1080
       */
    export enum AR16X9 {
        "270p" = 0,
        "360p" = 1,
        "480p" = 2,
        "540p" = 3,
        "720p" = 4,
        "1080p" = 5,
    }
    /** Video sizes for 4x3 aspect ratio
     * @example 1080p is 1440x1080
     */
    export enum AR4X3 {
        "270p" = 10,
        "360p" = 11,
        "480p" = 12,
        "540p" = 13,
        "720p" = 14,
        "1080p" = 15,
    }
    /** Video sizes for 1x1 aspect ratio
     * @example 1080p is 1080x1080
     */
    export enum AR1X1 {
        "270p" = 20,
        "360p" = 21,
        "480p" = 22,
        "540p" = 23,
        "720p" = 24,
        "1080p" = 25,
    }

    /** Audio Quality profiles */
    export enum AudioProfiles {
        /** Low Complexity Advanced Audio Coding */
        LCAAC = 0,
        /** High-Efficiency Advanced Audio Coding (better) */
        HEAAC = 1,
    }

    export enum VideoProfiles {
        /** low quality */
        BASELINE = 0,
        /** normal quality */
        MAIN = 1,
        /** high quality */
        HIGH = 2,
    }

    export enum InputStreamStatus {
        Connecting = 1000,
        Connected = 1001,
        Reconnection = 1003,
        Buffering = 1101,
        BufferFull = 1102,
        Resolution = 1104,
        None = 0,
    }
    export interface NodePlayerViewProps extends ViewProps {
        ref: any;
        inputUrl: string;

        /** 
         * @description Initial buffering duration 
         */
        bufferTime?: number;

        /** 
         * @description Maximum buffering duration 
         */
        maxBufferTime?: number;

        /** 
         * @description Should the video play on load?
         * @default false
         */
        autoplay?: boolean;

        /** 
         * @description Enable or disable audio 
         * @default true
         */
        audioEnable?: boolean;

        scaleMode?: "ScaleToFill" | "ScaleAspectFit" | "ScaleAspectFill";
        renderType?: "SURFACEVIEW" | "TEXTUREVIEW";
        cryptoKey?: string;

        onStatus?(code?: InputStreamStatus, status?: string): void;
    }

    export interface NodePlayerViewType extends View {
        pause(): void;
        stop(): void;
        start(): void;
    }
    export interface NodePlayerViewType extends View {
        /** Pause video */
        pause(): void;
        /** Stop video */
        stop(): void;
        /** Start video */
        start(): void;
    }

    export const NodePlayerView: React.ForwardRefRenderFunction<
        NodePlayerViewType,
        NodePlayerViewProps
    >;

    export const NodeCameraView: React.ForwardRefRenderFunction<
        NodeCameraViewType,
        NodeCameraViewProps
    >;
}
