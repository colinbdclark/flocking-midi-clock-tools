"use strict";

fluid.defaults("flock.ui.midiClockView", {
    gradeNames: [
        "fluid.viewComponent"
    ],

    refreshTickInterval: 24,

    members: {
        ticksUntilRefresh: "{that}.options.refreshTickInterval"
    },

    invokers: {
        refreshView: {
            funcName: "flock.ui.midiClockView.refreshView",
            args: ["{that}", "{clockReceiver}"]
        }
    },

    components: {
        clockReceiver: {
            type: "flock.midi.clockReceiver"
        }
    },

    events: {
        onTick: "{clockReceiver}.events.onTick",
        onRefreshView: null
    },

    listeners: {
        "onCreate.render": {
            funcName: "flock.ui.midiClockView.render",
            args: ["{that}"]
        },

        "onTick.decrementRefreshCounter": {
            funcName: "flock.ui.midiClockView.decrementRefreshCounter",
            args: ["{that}"]
        },

        "onRefreshView.refreshView": {
            func: "{that}.refreshView"
        }
    },

    selectors: {
        bpm: ".flock-clock-bpm"
    },

    markup: {
        clock: "<span class=flock-clock-bpm>0</span><span> bpm</span>"
    }
});



flock.ui.midiClockView.render = function (that) {
    that.container.append(that.options.markup.clock);
};


flock.ui.midiClockView.decrementRefreshCounter = function (that) {
    that.ticksUntilRefresh--;
    if (that.ticksUntilRefresh < 1) {
        that.events.onRefreshView.fire();
        that.ticksUntilRefresh = that.options.refreshTickInterval;
    }
};

flock.ui.midiClockView.refreshView = function (that, clockReceiver) {
    var roundedBPM = Math.round(clockReceiver.model.bpm);
    that.locate("bpm").html(roundedBPM);
};
