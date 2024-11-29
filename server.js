import express from 'express';
import { pgPool } from './pg_connection.js';

const app = express();

app.use(express.json());

app.listen(3001, () => {
    console.log("server running on port 3001");
});

app.post('/movie_user', async (req, res) =>{

    try{
        const result = await pgPool.query("SELECT * FROM movie_user");
        console.log(result.rows);
    }catch(e){
        console.log(e.message);
    }

});

app.post('/genre', async (req, res) =>{

    try{
        const result = await pgPool.query("SELECT * FROM genre");
        console.log(result);
    }catch(e){
        console.log(e.message);
    }

});

app.post('/movie', async (req, res) =>{

    try{
        const result = await pgPool.query("SELECT * FROM movie");
        console.log(result.rows);
    }catch(e){
        console.log(e.message);
    }

});

app.post('/review', async (req, res) =>{
    
    try{
        const result = await pgPool.query("SELECT * FROM review");
        console.log(result.rows);
    }catch(e){
        console.log(e.message);
    }

});

app.post('/favorite', async (req, res) =>{

    try{
        const result = await pgPool.query("SELECT * FROM favorite");
        console.log(result.rows);
    }catch(e){
        console.log(e.message);
    }

});