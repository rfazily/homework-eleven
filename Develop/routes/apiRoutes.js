// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var notesData = require("../db/db.json");


const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  //This will display all the notes saved in the data file

  app.get("/api/notes", function(req, res) {
    res.json(notesData);
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
// This allows the user to create new posts ---------------------------------------------------------------------------

  app.post("/api/notes", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
    let newNote = req.body;

    //find existing id in json File, assign the note to a different id number
    let existingID = notesData[notesData.length - 1]["id"];
    let newID = existingID + 1;
    newNote["id"] = newID;

    console.log("Req.body:", req.body);
    notesData.push(newNote);

    //write this data to the db.json file
    writeFileAsync("./db/db.json", JSON.stringify(notesData)).then(function() {
        console.log("notesData.json has been updated!");
    });

    res.json(newNote);

  });



  // ---------------------------------------------------------------------------
  // DELETING A POST

  app.delete("/api/notes/:id", function(req, res) {
    // let chosen = req.params.id;        
    // console.log(chosen);

    let chosenId = parseInt(req.params.id);
    console.log(chosenId);


    for (let i = 0; i < notesData.length; i++) {
        if (chosenId === notesData[i].id) {
            // deleted notesData[i];
            notesData.splice(i,1);
            
            let noteJSON = JSON.stringify(notesData, null, 2);

            writeFileAsync("./db/db.json", noteJSON).then(function() {
            console.log ("Chosen note has been deleted!");
        });                 
        }
    }
    res.json(notesData);
});
    
};

