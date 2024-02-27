const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
const apiPath = "/api/";
const version = "v1";
const port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//Our id counters
let nextTuneId = 4;

//The following is an example of an array of three tunes.
const tunes = [
    {
        id: "0",
        name: "Für Elise",
        tune: [
            { note: "E5", duration: "8n", timing: 0 },
            { note: "D#5", duration: "8n", timing: 0.25 },
            { note: "E5", duration: "8n", timing: 0.5 },
            { note: "D#5", duration: "8n", timing: 0.75 },
            { note: "E5", duration: "8n", timing: 1 },
            { note: "B4", duration: "8n", timing: 1.25 },
            { note: "D5", duration: "8n", timing: 1.5 },
            { note: "C5", duration: "8n", timing: 1.75 },
            { note: "A4", duration: "4n", timing: 2 },
            { note: "C4", duration: "8n", timing: 3 },
            { note: "E4", duration: "8n", timing: 3.25 },
            { note: "A4", duration: "8n", timing: 3.5 },
            { note: "B4", duration: "4n", timing: 3.75 },
            { note: "E4", duration: "8n", timing: 4.75 },
            { note: "G#4", duration: "8n", timing: 5 },
            { note: "B4", duration: "8n", timing: 5.25 },
            { note: "C5", duration: "4n", timing: 5.5 },
            { note: "E4", duration: "8n", timing: 6.5 },
            { note: "E5", duration: "8n", timing: 6.75 },
            { note: "D#5", duration: "8n", timing: 7 },
            { note: "E5", duration: "8n", timing: 7.25 },
            { note: "D#5", duration: "8n", timing: 7.5 },
            { note: "E5", duration: "8n", timing: 7.75 },
            { note: "B4", duration: "8n", timing: 8 },
            { note: "D5", duration: "8n", timing: 8.25 },
            { note: "C5", duration: "8n", timing: 8.5 },
            { note: "A4", duration: "4n", timing: 8.75 },
            { note: "C4", duration: "8n", timing: 9.75 },
            { note: "E4", duration: "8n", timing: 10 },
            { note: "A4", duration: "8n", timing: 10.25 },
            { note: "B4", duration: "4n", timing: 10.5 },
            { note: "E4", duration: "8n", timing: 11.5 },
            { note: "C5", duration: "8n", timing: 11.75 },
            { note: "B4", duration: "8n", timing: 12 },
            { note: "A4", duration: "4n", timing: 12.25 },
        ],
    },
    {
        id: "1",
        name: "The Godfather",
        tune: [
            { note: "G4", duration: "4n", timing: 0 },
            { note: "C5", duration: "4n", timing: 0.5 },
            { note: "D#5", duration: "4n", timing: 1 },
            { note: "D5", duration: "4n", timing: 1.5 },
            { note: "C5", duration: "4n", timing: 2 },
            { note: "D#5", duration: "4n", timing: 2.5 },
            { note: "C5", duration: "4n", timing: 3 },
            { note: "D5", duration: "4n", timing: 3.5 },
            { note: "C5", duration: "4n", timing: 4 },
            { note: "G#4", duration: "4n", timing: 4.5 },
            { note: "Bb4", duration: "4n", timing: 5 },
            { note: "G4", duration: "2n", timing: 5.5 },
            { note: "G4", duration: "4n", timing: 8 },
            { note: "C5", duration: "4n", timing: 8.5 },
            { note: "D#5", duration: "4n", timing: 9 },
            { note: "D5", duration: "4n", timing: 9.5 },
            { note: "C5", duration: "4n", timing: 10 },
            { note: "D#5", duration: "4n", timing: 10.5 },
            { note: "C5", duration: "4n", timing: 11 },
            { note: "D5", duration: "4n", timing: 11.5 },
            { note: "C5", duration: "4n", timing: 12 },
            { note: "G4", duration: "4n", timing: 12.5 },
            { note: "F#4", duration: "4n", timing: 13 },
            { note: "F4", duration: "2n", timing: 13.5 },
            { note: "F4", duration: "4n", timing: 16 },
            { note: "G#4", duration: "4n", timing: 16.5 },
            { note: "B4", duration: "4n", timing: 17 },
            { note: "D5", duration: "2n", timing: 17.5 },
            { note: "F4", duration: "4n", timing: 20 },
            { note: "G#4", duration: "4n", timing: 20.5 },
            { note: "B4", duration: "4n", timing: 21 },
            { note: "C5", duration: "2n", timing: 21.5 },
            { note: "C4", duration: "4n", timing: 24 },
            { note: "D#4", duration: "4n", timing: 24.5 },
            { note: "Bb4", duration: "4n", timing: 25 },
            { note: "G#4", duration: "4n", timing: 25.5 },
            { note: "G4", duration: "4n", timing: 26 },
            { note: "Bb4", duration: "4n", timing: 26.5 },
            { note: "G#4", duration: "4n", timing: 27 },
            { note: "G#4", duration: "4n", timing: 27.5 },
            { note: "G4", duration: "4n", timing: 28 },
            { note: "G4", duration: "4n", timing: 28.5 },
            { note: "B3", duration: "4n", timing: 29 },
            { note: "C4", duration: "2n", timing: 29.5 },
        ],
    },
    {
        id: "3",
        name: "Seven Nation Army",
        tune: [
            { note: "E5", duration: "4n", timing: 0 },
            { note: "E5", duration: "8n", timing: 0.5 },
            { note: "G5", duration: "4n", timing: 0.75 },
            { note: "E5", duration: "8n", timing: 1.25 },
            { note: "E5", duration: "8n", timing: 1.75 },
            { note: "G5", duration: "4n", timing: 1.75 },
            { note: "F#5", duration: "4n", timing: 2.25 },
        ],
    },
    // E, E, G, E, E, G, F#; E, E, G, E, E, G, A, G, F# (all 5); C C C C C C C C D D D D D D D D (all 4); start
];
//Tune endpoints
app.get(apiPath + version + "/tunes", (req, res) => {
    res.status(200).json(tunes);
});

app.post(apiPath + version + "/tunes", (req, res) => {
    if (
        !req.body ||
        !req.body.name ||
        !req.body.tune ||
        typeof req.body.tune !== "object" ||
        !req.body.tune.length ||
        req.body.tune.length <= 0
    ) {
        return res.status(400).json({
            message: "Tunes require at least a name, and a non-empty tune array.",
        });
    } else {
        //Reset array after length 50 to avoid overflows.
        if (tunes.length > 50) {
            tunes.length = 3;
            nextTuneId = 4;
        }

        console.log(req.body);

        const newTune = {
            id: nextTuneId.toString(),
            name: req.body.name.toString(),
            tune: req.body.tune,
        };

        tunes.push(newTune);
        nextTuneId++;

        res.status(201).json(newTune);
    }
});

//Default: Not supported
app.use("*", (req, res) => {
    res.status(405).send("Operation not supported.");
});

app.listen(port, () => {
    console.log("Tunes app listening on Port " + port);
});

