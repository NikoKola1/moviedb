import express from 'express';

const app = express();

app.use(express.json());

app.listen(3001, () => {
    console.log("server running on port 3001");
});

app.post('/movie_user', (req, res) =>{

    let movie_user = req.body;
    console.log(movie_user);
    res.send();

});

app.post('/genre', (req, res) =>{

    let genre = req.body;
    console.log(genre);
    res.send();

});

app.post('/movie', (req, res) =>{

    let movie = req.body;
    console.log(movie);
    res.send();

});

app.post('/review', (req, res) =>{
    
    let review = req.body;
    console.log(review);
    res.send();

});

app.post('/favorite', (req, res) =>{
    
    let favorite = req.body;
    console.log(favorite);
    res.send();

});