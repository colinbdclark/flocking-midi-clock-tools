"use strict";

fluid.defaults("flock.ui.midiClockView.demo", {
    gradeNames: "fluid.viewComponent",

    components: {
        connector: {
            type: "flock.ui.midiConnector",
            container: "{demo}.dom.midiConnector",
            options: {
                events: {
                    afterConnectionOpen: "{demo}.events.afterConnectionOpen"
                }
            }
        },

        clockReceiver: {
            createOnEvent: "afterConnectionOpen",
            type: "flock.midi.clockReceiver",
            options: {
                components: {
                    connection: "{connector}.connection"
                }
            }
        },

        clockView: {
            createOnEvent: "afterConnectionOpen",
            type: "flock.ui.midiClockView",
            container: "{demo}.dom.clockView",
            options: {
                components: {
                    clockReceiver: "{demo}.clockReceiver"
                }
            }
        }
    },

    events: {
        afterConnectionOpen: null,
        onTick: null
    },

    selectors: {
        clockView: ".flock-clockView",
        midiConnector: ".flock-midiConnector"
    }
});
