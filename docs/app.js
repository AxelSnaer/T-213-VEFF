
//const url   = 'http://localhost:3000/api/v1';
const url   = 'http://173.249.17.254:3000/api/v1';
const synth = new Tone.Synth().toDestination();

class Note {
    // Note class that is equivalent to the
    // server side model for easy storing

    constructor(pitch, duration = "8n", timing = 0) {
        this.note = pitch;
        this.duration = duration;
        this.timing = timing;
    }

    play() {
        synth.triggerAttackRelease(
            this.note,
            this.duration, 
            Tone.now() + this.timing
        );
    }
}

class Recording {
    constructor() {
        this.startTime = null;
        this.tune = [];
    }

    addNote(pitch) {
        // Start counting from the first note
        // to avoid any dead time at the start
        if (this.startTime == null)
            Date.now()

        // Get the time difference since the start to figure out the offset
        const timing = (Date.now() - this.startTime) / 1000;
        this.tune.push(new Note(pitch, "8n", timing));
    }
    
    finish(name) {
        // Turn this recording into a tune that can be saved later
        return new Tune(name, this.tune);
    }
}

class Tune {
    // List of notes with a name that is equivalent to the
    // server side representation of a tune for easy storing

    constructor(name, notes = []) {
        this.name = name;
        this.tune = notes;
    }

    load(tuneInfo) {
        // Load the tune from the server side representation of a tune
        tuneInfo.tune.forEach(note => {
            this.tune.push(new Note(note.note, note.duration, note.timing));
        });
    }

    play() {
        // Play every note in the tune at once since each note
        // stores it's offset
        this.tune.forEach(note => note.play());
    }
}

class TuneList {
    constructor() {
        this.list = [];
    }

    addTune(tune) {
        this.list.push(tune);
    }

    play(id) {
        this.list[id].play();
    }

    playSelected() {
        const selection = document.querySelector("#tunesDrop");
        this.play(selection.value);
    }

    async refresh(api) {
        // Re-fetch the tunes from the server and update the tune selection

        const tunes = await api.fetchTunes();
        this.list = [];

        tunes.forEach(tune => {
            let newTune = new Tune(tune.name);
            newTune.load(tune);
            this.list.push(newTune);
        });

        this.refreshTuneListSelection();
    }

    refreshTuneListSelection() {
        // Update the selection dropdown with the current state of the tune list

        const tuneListSelection = document.querySelector("#tunesDrop");
        tuneListSelection.innerHTML = "";

        this.list.forEach((tune, i) => {
            const tuneOption = document.createElement("option");
            tuneOption.text = tune.name;
            tuneOption.value = i;
            tuneListSelection.appendChild(tuneOption);
        })
    }
}

class Recorder {
    constructor(startRecordingButton, endRecordingButton, recordingNameField) {
        this.startRecordingButton = startRecordingButton;
        this.endRecordingButton = endRecordingButton;
        this.recordingNameField = recordingNameField;
        this.recording = null;
    }

    record(pitch) {
        // Try to record a note only if it's recording
        if (this.recording != null)
            this.recording.addNote(pitch);
    }

    startRecording() {
        this.recording = new Recording();

        // Update button states
        this.startRecordingButton.disabled = true;
        this.endRecordingButton.disabled = false;
    }

    endRecording(tuneAPI, tuneList) {
        // Retrieve the tune from the recording
        const name = this.recordingNameField.value;
        const tune = this.recording.finish(name);

        // Add the tune to the tune list on both client and server
        tuneList.addTune(tune);
        tuneList.refreshTuneListSelection();
        tuneAPI.postTune(tune);

        // Reset recording
        this.recording = null;

        // Update button states
        this.startRecordingButton.disabled = false;
        this.endRecordingButton.disabled = true;
    }
}

class TuneAPI {
    // Wrapper for the server api

    constructor(url) {
        this.url = url;
    }

    async fetchTunes() {
        // Fetch a list of tunes as generic javascript objects from the server

        try {
            const response = await axios.get(`${url}/tunes`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return;
        }
    }

    async postTune(tune) {
        // Post a tune object to the server

        try {
            axios.post(`${url}/tunes`, tune);
        }
        catch (error) {
            console.error(error);
        }
    }
}

class App {
    constructor() {
        this.playTuneButton       = document.querySelector("#tunebtn");
        this.startRecordingButton = document.querySelector("#recordbtn");
        this.endRecordingButton   = document.querySelector("#stopbtn");
        this.recordingNameField   = document.querySelector("#recordName");

        this.keymap = {};

        this.tuneAPI = new TuneAPI(url);

        this.recorder = new Recorder(
            this.startRecordingButton,
            this.endRecordingButton,
            this.recordingNameField
        );
        this.tuneList = new TuneList();

        this.tuneList.refresh(this.tuneAPI);
        this.setupKeyboard();
        this.setupPlaybackControls();
    }

    setupKeyboard() {
        const keyboard = document.querySelector("#keyboardDiv");

        // sigh... if ONLY i could use a regular for loop
        Array.from(keyboard.children).forEach(note => {
            // Extracts the key from the text content in the note button element
            // '\n   (k)' -> '(k)' -> 'k'
            const key = note.childNodes[2].textContent.trim()[1];
            this.keymap[key] = note;

            note.addEventListener("click", () => {
                this.recorder.record(note.id);

                new Note(note.id).play();
            });
        });

        this.setupKeybinds();
    }

    setupPlaybackControls() {
        this.playTuneButton
            .addEventListener("click", () => this.tuneList.playSelected());
        this.startRecordingButton
            .addEventListener("click", () => this.recorder.startRecording());
        this.endRecordingButton
            .addEventListener("click", () => this.recorder.endRecording(this.tuneAPI, this.tuneList));
    }

    setupKeybinds() {
        document.addEventListener("keydown", e => {
            if (document.activeElement.tagName == "INPUT")
                return;

            if (this.keymap[e.key])
                this.keymap[e.key].click();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new App());
