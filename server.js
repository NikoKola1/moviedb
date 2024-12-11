import express from 'express';
import { pgPool } from './pg_connection.js';

const app = express();

app.use(express.json());

app.listen(3001, () => {
    console.log("server running on port 3001");
});

//Registering user with name, usernam, password and birth year
app.post('/movie_user', async (req, res) =>{
    try{
        const {name, username, password, birth_year} = req.body;

        if (!name || !username || !password || !birth_year) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const result = await pgPool.query("INSERT INTO movie_user (name, username, password, birth_year) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, username, password, birth_year]
        );

        console.log(result.rows);
        res.status(201).json({message: "User register done", user: result.rows});
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: "Error registering user", error: e.message});
    }
});

//adding new genre
app.post('/genre', async (req, res) =>{
    try{
        const {genre_name} = req.body;
        if (!genre_name) {
            return res.status(400).json({ message: "Genre name is required"});
        }
        const result = await pgPool.query("INSERT INTO genre (genre_name) VALUES ($1) RETURNING *",
            [genre_name]
        );
        console.log(result.rows);
        res.status(201).json({message: "Genres fetched", genre: result.rows});
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: "Error adding genre", error: e.message});
    }
});

//adding new movie with movie name, year and genre
app.post('/movie', async (req, res) =>{
    try{
        const {movie_name, year, genre_name} = req.body;

        if (!movie_name || !year || !genre_name) {
            return res.status(400).json({message: "Movie name, year, and genre are required"});
        }
        const result = await pgPool.query("INSERT INTO movie (movie_name, year, genre_name) VALUES ($1, $2, $3) RETURNING *",
            [movie_name, year, genre_name]
        );
        res.status(201).json({message: "Movie added", movie: result.rows});
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: "Error adding movie", error: e.message});
    }
});

//getting movie by id
app.get('/movie/:id', async (req, res) =>{
        const movieId = req.params.id;
    try{
        const result = await pgPool.query("SELECT * FROM movie WHERE movie_id = $1", [movieId]);
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Movie not found"});
        }
        res.status(200).json({message: "Movie fetch success", movie: result.rows});
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: "Movie fetch no success", error: e.message});
    }
});

//deleting movie by id
app.delete('/movie/:id', async (req, res) =>{
    const movieId = req.params.id;
try{
    const result = await pgPool.query("DELETE FROM movie WHERE movie_id = $1 RETURNING *", [movieId]);
    if (result.rows.length === 0) {
        return res.status(404).json({message: "Movie not found"});
    }
    res.status(200).json({message: "Movie delete success", movie: result.rows});
}catch(e){
    console.log(e.message);
    res.status(500).json({message: "Movie delete no success", error: e.message});
}
});

//add movie review with username stars review text and mmovie id, there is only user_id in the reviews table but reviews can be added with username but only id shows in reviews table
app.post('/review', async (req, res) =>{
        const {username, stars, review_text, movie_id} = req.body;
        if (!username || !stars || !review_text || !movie_id) {
            return res.status(400).json({ message: "All fields are required"});
        }
        try{
            const result = await pgPool.query(
                "INSERT INTO review (user_id, movie_id, stars, review_text) " +
                "SELECT user_id, $2, $3, $4 FROM movie_user WHERE username = $1 RETURNING *",
                [username, movie_id, stars, review_text]
            );
            res.status(201).json({message: "Add review success", data: result.rows[0]});
        }catch(e){
            console.log(e.message);
            res.status(500).json({message: "Error adding review", error: e.message});
        }
    });


//adding favorite movies for user
app.post('/favorite', async (req, res) =>{
    const {username, movie_id} = req.body;

    if (!username || !movie_id) {
        return res.status(400).json({message: "Username and movie ID are required"});
    }
    try{
        const result = await pgPool.query( 
            "INSERT INTO favorite (user_id, movie_id) " +
            "SELECT user_id, $2 FROM movie_user WHERE username = $1 RETURNING *",
            [username, movie_id]);
        res.status(201).json({message:"Movie added to favs", favorite: result.rows});
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: "Error adding movie", error: e.message});
    }
});

//get favorite movie by username
app.get('/favorite/:username', async (req, res) =>{
    const {username} = req.params;
    try{
        const userResult = await pgPool.query(
            "SELECT user_id FROM movie_user WHERE username = $1", [username]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user_id = userResult.rows[0].user_id;

        const result = await pgPool.query("SELECT * FROM movie WHERE movie_id IN (SELECT movie_id FROM favorite WHERE user_id = $1)", [user_id]);
        res.status(200).json({message: "Favorite movies fetch success", data: result.rows});
    }catch(e){
        console.log(e.message);
        res.status(500).json({message: "Favorite movie fetch no succes", error: e.message});
    }
});


// fetch movie with keyword and feature getting 10 per page 
app.get('/movie', async (req, res) => {
    //pagination made here because searching with keyword didnt work if pagination was own endpoint
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let keyword = req.query.keyword ? `%${req.query.keyword.toLowerCase()}%` : null;

    try {
        let result;
        //if no keyword, fetch all movies
        if (!keyword) {
            result = await pgPool.query("SELECT movie_name FROM movie LIMIT $1 OFFSET $2", [limit, offset]);
        } else {
            //if yes keyword then search with it
            keyword = '%' + keyword.toLowerCase() + '%';
            result = await pgPool.query(
                "SELECT movie_name FROM movie WHERE LOWER(movie_name) LIKE $1 LIMIT $2 OFFSET $3",
                [keyword, limit, offset]
            );
        }
        res.status(200).json({message: "Movie fetch success", data: result.rows});
    } catch (e) {
        console.log("error:", e.message);
        res.status(500).json({ message: "Failed fetch movie", error: e.message });
    }
});
