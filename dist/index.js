function initialize() {
    microsoftTeams.initialize(() => {}, [
        "https://nerocui.github.io",
    ]);
    microsoftTeams.appInitialization.notifySuccess();
    registerHandlers();
}

function registerHandlers() {
    microsoftTeams.video.registerForVideoEffect(effectParameterChanged);
    microsoftTeams.video.registerForVideoFrame(videoFrameHandler, {
        format: "NV12",
    });
}

function notifyEffectChange() {
    microsoftTeams.video.notifySelectedVideoEffectChanged("EffectChanged");
}

function notifyEffectDisable() {
    microsoftTeams.video.notifySelectedVideoEffectChanged("EffectDisabled");
}

function effectParameterChanged(effectName) {
    console.log(`Parameter changed. ${effectName}`);
}

function videoFrameHandler(videoFrame, notifyVideoProcessed) {
    for (let i = 0; i < videoFrame.data.length; i++) {
        // Invert the colors
        videoFrame.data[i] = 255 -videoFrame.data[i];
    }
    notifyVideoProcessed();
}

initialize();
