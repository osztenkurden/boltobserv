const gsi = require("./modules/gsi")
const path = require("path")

module.exports = {
    startRadar: (app, io) => {
        gsi.init(io);
        app.get("/radar", (req, res) => {
            res.sendFile(path.join(__dirname, "html", "index.html"))
        })
    },
    digestRadar: csogsi => {
        gsi.digest(csogsi);
    }
}