const express = require('express')
const app = express()
const {url} = require("./url")



app.post("/api/shorturl", (req, res) => {
    res.status(200).json({url});
})

app.get("/api/shorturl/:short_url", (req, res) => {

    const { short_url } = req.params

    for (let i=0; i<url.length; i++) {
        if (url[i].short_url === Number(short_url)) {
            res.redirect(url[i].original_url);
        }
    }
    res.json({success: false, error: "Invalid Url"})

})

app.get("*", (req, res) => {
    res.json({success: false, error: "Invalid Url"})
})


app.listen(3000)