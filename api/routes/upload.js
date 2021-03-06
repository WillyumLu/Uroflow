var express = require("express");
var router = express.Router();

const { Recording } = require("../models/recording");
const uuidv1 = require("uuid/v1");

var multer = require("multer");
// var upload = multer({ dest: "uploads/recordings" }).single(
//     "INPUT-FIELD-NAME-HERE"
// );

const { handleJWTVerification } = require("../middleware");

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const path = __dirname.replace("routes", "") + "uploads/recordings";
        console.log("Setting up destination: " + path);
        callback(null, path);
    },
    filename: function(req, file, callback) {
        // TODO: ADD MORE FILE TYPE HERE !!!!!
        if (file.mimetype.includes("wave") || file.mimetype.includes("wav")) {
            callback(null, uuidv1() + "." + "wav");
        } else if (file.mimetype.includes("caf")) {
            callback(null, uuidv1() + "." + "caf");
        } else if (file.mimetype.includes("ogg")) {
            callback(null, uuidv1() + "." + "ogg");
        } else {
            console.log(`File ${file.originalname} doesn't have a normal type`);
            callback(null, uuidv1() + "." + "wav");
        }
    }
});
var upload = multer({ storage: storage }).single("INPUT-FIELD-NAME-HERE");

/* POST to upload audio. */
router.post("/", handleJWTVerification, function(req, res, next) {
    upload(req, res, function(err) {
        console.log(`Before saving file, identify user: ${req.user.id} - ${req.user.email}`);

        // !!!!! **********TODO*********** !!!!!: CHECK WHETHER USERID EXISTS OR NOT
        
        console.log("File info: ");
        console.log(req.file);
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(500).send({ flag: false, error: err });
            return;
        } else if (err) {
            // An unknown error occurred when uploading.
            res.status(400).send({ flag: false, error: err });
            return;
        }
        // Everything went fine.

        // update recording table
        // const userId = req.body.userId;
        const userId = req.user.id;
        console.log(`User is: ${userId}`);
        Recording.create({
            url: req.file.destination + "/" + req.file.filename,
            comment: req.body.comment,
            userId: userId
        }).then((result) => {
            res.send({ flag: true, recording: result });
        }).catch((err) => {
            res.send({ flag: false, error: err });
        });
    });
});

module.exports = router;
