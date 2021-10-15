function encode(nv12) {
    var x = new Uint8ClampedArray(nv12);
    let y_mat = new cv.Mat(16, 2, cv.CV_8UC1)
    let u_mat = new cv.Mat(8, 1, cv.CV_8UC1)
    let v_mat = new cv.Mat(8, 1, cv.CV_8UC1)
    //16*2 + 8*1 + 8*1
    for (var i = 0; i < 2* 16; i++) {
        y_mat.data[i] = x[i];
    }

    for (var i = 32; i < x.length; i+=2) {
        u_mat.data[i] = x[i];
        v_mat.data[i] = x[i + 1];
    }
    let u_mat_2 = new cv.Mat();
    cv.resize(u_mat, u_mat_2, new cv.Size(16, 2), 0, 0, cv.INTER_AREA);
    let v_mat_2 = new cv.Mat();
    cv.resize(v_mat, v_mat_2, new cv.Size(16, 2), 0, 0, cv.INTER_AREA);

    let yuv_mat = new cv.Mat(16, 2, cv.CV_8UC3)
    for (var i = 0; i < x.length; i++) {
        if (i < 32)
            yuv_mat.data[i] = y_mat.data[i];
        else {
            if (i < 32 + 32)
                yuv_mat.data[i] = u_mat_2.data[i];
            else
                yuv_mat.data[i] = v_mat_2.data[i];
        }
    }
    let dst = new cv.Mat();
    cv.cvtColor(yuv_mat, dst, cv.COLOR_YUV2BGR, 0);
    return dst;
}

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
    try {
        const mat = encode(videoFrame.data);
        console.log(mat);
    } catch (err) {
        console.log(err);
    }
    
    notifyVideoProcessed();
}

cv['onRuntimeInitialized'] = function() {
    initialize();
}
