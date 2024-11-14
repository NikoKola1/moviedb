
CREATE TABLE genre(  
    genre_name VARCHAR(255) NOT NULL PRIMARY KEY
);
CREATE TABLE movie(  
    movie_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    movie_name VARCHAR(255),
    YEAR INT,
    genre_name VARCHAR(255),
    Foreign Key (genre_name) REFERENCES genre(genre_name)
);
CREATE TABLE movie_user(  
    user_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    birth_year int
);
CREATE TABLE review(  
    review_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    movie_id INT,
    stars INT,
    review_text TEXT,
    Foreign Key (user_id) REFERENCES movie_user(user_id),
    Foreign Key (movie_id) REFERENCES movie(movie_id)
);
CREATE TABLE favorite(  
    favorite_id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT,
    movie_id INT,
    Foreign Key (user_id) REFERENCES movie_user(user_id),
    Foreign Key (movie_id) REFERENCES movie(movie_id)
);

INSERT INTO genre (genre_name)VALUES 
('drama'),('comedy'),('scifi'),('fantasy'),('action'),('triller');

INSERT INTO movie (movie_name, year, genre_name) VALUES 
('Inception', 2010, 'action'),
('The Terminator', 1984, 'action'),
('Tropic Thunder', 2008, 'comedy'),
('Borat', 2006, 'comedy'),
('Interstellar', 2014, 'drama'),
('Joker', 2019, 'drama');

INSERT INTO movie_user (username,name,birth_year)VALUES
('niko', 'Niko Kola', 'qwerty123', 1996),
('lizzy', 'Lisa Simpson', 'abcdef', 1991 ),
('boss', 'Ben Bossy', 'salasana', 1981 )
