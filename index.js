import express from "express";
import fs from "fs"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/",(req,res)=>{
    const message = req.query.message
    fs.readdir('./notes',(err, files)=>{
        res.render("index",{files: files, message:message});
    })
})
app.get("/note/:noteName",(req,res)=>{
    fs.readFile(`./notes/${req.params.noteName}`,(err,data)=>{
        res.render("note",{val: req.params.noteName,data:data});
    })
})

function isEmptyOrSpaces(str) {
    return str.trim().length === 0;
}

app.post("/create",(req,res)=>{
    // console.log(req.body)
    if(isEmptyOrSpaces(req.body.title) || isEmptyOrSpaces(req.body.details)){
        return res.redirect(`/?message=${encodeURIComponent("Unable to create note!")}`)
    }
    fs.writeFile(`./notes/${req.body.title}.txt`,req.body.details,(err)=>{
        if (err) {
            return res.status(500)
        }
        res.redirect(`/`)
    })
})

app.get("/delete/:noteName",(req,res)=>{
    let noteName = req.params.noteName;
    if (fs.existsSync(`./notes/${noteName}`)) {
        fs.unlink(`./notes/${noteName}`, (err) => {
            if (err) {
                console.log(err);
                return res.redirect(`/?message=${encodeURIComponent("Note can't delete!")}`)
            }
            res.redirect("/")
        })
    }
})

app.listen(80,()=>{
    console.log("Listing on port 8080");
})
