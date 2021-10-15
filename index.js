function encode(nv12, width, height) {
    let y_mat = new cv.Mat(width, height, cv.CV_8UC1)
    let u_mat = new cv.Mat(width/2, height/2, cv.CV_8UC1)
    let v_mat = new cv.Mat(width/2, height/2, cv.CV_8UC1)
    //16*2 + 8*1 + 8*1
    for (var i = 0; i < height* width; i++) {
        y_mat.data[i] = nv12[i];
    }

    var j = 0;
    for (var i = width * height; i < nv12.length; i+=2) {
        u_mat.data[j] = nv12[i];
        v_mat.data[j] = nv12[i + 1];
        j++;
    }
    let u_mat_2 = new cv.Mat();
    cv.resize(u_mat, u_mat_2, new cv.Size(width, height), 0, 0, cv.INTER_NEAREST);
    let v_mat_2 = new cv.Mat();
    cv.resize(v_mat, v_mat_2, new cv.Size(width, height), 0, 0, cv.INTER_NEAREST);

    let yuv_mat = new cv.Mat(width, height, cv.CV_8UC3)
    var counter = 0;
    for (var i = 0; i < width*height; i++) {
        yuv_mat.data[counter] = y_mat.data[i];
        yuv_mat.data[counter+1] = u_mat_2.data[i];
        yuv_mat.data[counter+2] = v_mat_2.data[i];
        counter+=3;
    }
    let dst = new cv.Mat();
    cv.cvtColor(yuv_mat, dst, cv.COLOR_YUV2BGR, 0);
    
    return dst;
}


function decode(bgr_mat, width, height) {
    let yuv_mat = new cv.Mat();
    cv.cvtColor(bgr_mat, yuv_mat, cv.COLOR_BGR2YUV, 0);
    let y_mat = new cv.Mat(width, height, cv.CV_8UC1);
    let u_mat = new cv.Mat(width, height, cv.CV_8UC1);
    let v_mat = new cv.Mat(width, height, cv.CV_8UC1);

    for (var i = 0; i < width * height; i++) {
        y_mat.data[i] = yuv_mat.data[i]
    }
    for (var i = width * height; i < width * height*2; i++) {
        u_mat.data[i] = yuv_mat.data[i]
    }
    for (var i = width * height*2; i < width * height * 3; i++) {
        v_mat.data[i] = yuv_mat.data[i]
    }
    let u_mat_2 = new cv.Mat(width / 2, height / 2, cv.CV_8UC1);
    let v_mat_2 = new cv.Mat(width / 2, height / 2, cv.CV_8UC1);
    cv.resize(u_mat, u_mat_2, new cv.Size(width / 2, height / 2), 0, 0, cv.INTER_AREA);
    cv.resize(v_mat, v_mat_2, new cv.Size(width / 2, height / 2), 0, 0, cv.INTER_AREA);
    let array_1d = [];
    for (var i = 0; i < y_mat.data.length; i++) {
        array_1d.push(y_mat.data[i]);
    }
    for(var i = 0; i < u_mat_2.data.length; i++) {
        array_1d.push(u_mat_2.data[i]);
        array_1d.push(v_mat_2.data[i]);
    }
    let x = new Uint8ClampedArray(array_1d);
    return x
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
        const mat = encode(videoFrame.data, videoFrame.width, videoFrame.height);
        if (!mat) return;
        cv.line(mat, new cv.Point(0, 0), new cv.Point(100, 100), [255, 255, 255, 255], 10);
        const res = decode(mat, videoFrame.width, videoFrame.height);
        for (var i = 0; i < videoFrame.data.length; i++) {
            videoFrame.data[i] = res[i];
        }
    } catch (err) {
        console.log(err);
    }
    
    notifyVideoProcessed();
}

cv['onRuntimeInitialized'] = function() {
    initialize();
}
