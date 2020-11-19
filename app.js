const bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    port = 30000;


mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/model config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

//restful routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
})


//new route
app.get("/blogs/new", (req, res) => {
    res.render("new");
})

app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs")
        }
    })
})

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("error!");
        } else {
            res.render("index", { blogs: blogs });
        }
    })
})

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog })
        }
    })
})

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    })

})

//update route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//Delete route
app.delete("/blogs/:id", (req, res) => {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/blog");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});