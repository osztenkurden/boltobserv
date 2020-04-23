const express = require("express")
const path = require("path")
const ip = require("ip");
const app = express()
const server = app.listen(1337, () => {
	console.info(`Browser view enabled at http://${ip.address()}:1337`)
})
const io = require("socket.io").listen(server)
const radar = require("./init.js");
app.use(express.urlencoded({extended:true}));
app.use(express.raw({limit: '10Mb', type: 'application/json'}));
app.use((req, _res, next) => {
	try{
		if(req.body){
			const payload = req.body.toString();
			const text = payload.replace(/"(player|owner)":([ ]*)([0-9]+)/gm, '"$1": "$3"').replace(/(player|owner):([ ]*)([0-9]+)/gm, '"$1": "$3"');
			req.body = JSON.parse(text);
		}
		next();
	} catch(e) {
		next();
	}
});

radar.startRadar(app, io);

for (let dir of ["css", "renderers", "img", "maps"]) {
	app.use(`/boltobserv/${dir}`, express.static(path.join(__dirname, dir)))
}
app.post("/", (req, res) => {
	radar.digestRadar(req.body);
	res.sendStatus(200);
});
app.get("/radar", (req, res) => {
	res.sendFile(path.join(__dirname, "html", "index.html"))
})
