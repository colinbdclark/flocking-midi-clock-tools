"use strict";

fluid.defaults("flock.midi.clockReceiver", {
    gradeNames: "fluid.modelComponent",

    numIntervals: 12,

    members: {
        intervals: {
            expander: {
                funcName: "flock.midi.clockReceiver.createIntervalArray",
                args: ["{that}.options.numIntervals"]
            }
        },
        intervalIdx: 0,
        lastTickTime: 0
    },

    model: {
        bpm: 0
    },

    components: {
        connection: {
            type: "fluid.mustBeOverridden"
        }
    },

    events: {
        onTick: "{connection}.events.clock"
    },

    listeners: {
        "onTick.calcBPM": {
            funcName: "flock.midi.clockReceiver.calculateBPM",
            args: ["{that}", "{arguments}.1"]
        }
    }
});

flock.midi.clockReceiver.createIntervalArray = function (len) {
    return new Float32Array(len);
};

flock.midi.clockReceiver.writeInterval = function (that, interval) {
    that.intervalIdx++;
    if (that.intervalIdx >= that.options.numIntervals) {
        that.intervalIdx = 0;
    }

    that.intervals[that.intervalIdx] = interval;
};

flock.midi.clockReceiver.calculateBPM = function (that, midiEvent) {
    var now = midiEvent.timeStamp,
        lastTickTime = that.lastTickTime,
        interval = now - lastTickTime;

    that.lastTickTime = now;
    flock.midi.clockReceiver.writeInterval(that, interval);

    var avgInterval = flock.midi.clockReceiver.calculateAvgInterval(that.intervals);
    var bpm = (1000 / avgInterval / 24) * 60;
    that.applier.change("bpm", bpm);
};

flock.midi.clockReceiver.calculateAvgInterval = function (intervals) {
    var sum = 0;
    for (var i = 0; i < intervals.length; i++) {
        sum += intervals[i];
    }

    return sum / intervals.length;
};
