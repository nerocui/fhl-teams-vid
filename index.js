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

var saved = false;

function videoFrameHandler(videoFrame, notifyVideoProcessed) {
    try {
        if (!saved) {
            localStorage.setItem("videoFrame", videoFrame.data);
            saved = true;
        }
        const mat = cv.matFromImageData(videoFrame.data);
        console.log(mat);
    } catch (err) {
        console.log(err);
    }
    
    notifyVideoProcessed();
}

initialize();
