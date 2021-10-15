function initialize() {
    microsoftTeams.initialize(() => {}, [
        "https://nerocui.github.io/fhl-teams-vid",
    ]);//change to https://fhl.local:3000 for local dev
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
    const mat = cv.matFromImageData(videoFrame.data);
    console.log(mat);
    notifyVideoProcessed();
}

initialize();
