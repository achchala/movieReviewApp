import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
const delimiter = '|'; // Choose a delimiter that is not present in the review content

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));


app.post('/api/loadUserSettings', (req, res) => {

	let connection = mysql.createConnection(config);
	let userID = req.body.userID;

	let sql = `SELECT mode FROM user WHERE userID = ?`;
	console.log(sql);
	let data = [userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });
	});
	connection.end();
});

// API endpoint to get movies
app.post('/api/getMovies', (req, res) => {
	let sql = `SELECT * FROM movies`; // SQL query to retrieve all movies
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
  
	// Execute the SQL query
	connection.query(sql, (error, results, fields) => {
	  if (error) {
		console.error(error.message); // Log the error message
		res.status(500).send('Error retrieving movies'); // Send an error response
	  } else {
		res.send(results); // Send the query results as the response
	  }
	});
  
	connection.end(); // Close the MySQL connection
  });
  
  // API endpoint to add a review
  app.post('/api/addReview', (req, res) => {
	const { movieId, userId, reviewTitle, reviewContent, reviewScore } = req.body; // Extract review data from the request body
  
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
  
	// Insert the review data into the 'Review' table
	const sql = `INSERT INTO Review (reviewID, reviewTitle, reviewContent, reviewScore, userID, movieID) VALUES (NULL, ?, ?, ?, ?, ?)`;
	const values = [reviewTitle, reviewContent, reviewScore, userId, movieId];
  
	// Execute the SQL query
	connection.query(sql, values, (error, results) => {
	  if (error) {
		console.error('Error adding review to MySQL:', error); // Log the error message
		res.status(500).json({ error: 'Failed to add review to MySQL' }); // Send an error response
	  } else {
		console.log('Review added to MySQL'); // Log a success message
		res.status(200).json({ message: 'Review added successfully' }); // Send a success response
	  }
	  connection.end(); // Close the MySQL connection
	});
  });

  app.post('/api/searchMovies', (req, res) => {
	const { title, actor, director } = req.body; // Extract search criteria from the request body
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
	console.log('Search criteria:', { title, actor, director }); // Log the search criteria
	let sql = `
	  SELECT 
		m.name AS movieTitle,
		CONCAT(d.first_name, ' ', d.last_name) AS directorName,
		GROUP_CONCAT(DISTINCT r.reviewContent SEPARATOR '${delimiter}') AS reviews
		FROM 
		movies m
	  LEFT JOIN movies_directors md ON m.id = md.movie_id
	  LEFT JOIN directors d ON md.director_id = d.id
	  LEFT JOIN Review r ON m.id = r.movieID
	  LEFT JOIN roles rl ON m.id = rl.movie_id
	  LEFT JOIN actors a ON rl.actor_id = a.id
	`;
	let conditions = [];
	
	if (title) {
	  conditions.push(`m.name LIKE '%${title}%'`);
	}
	if (actor) {
	  conditions.push(`CONCAT(a.first_name, ' ', a.last_name) LIKE '%${actor}%'`);
	}
	if (director) {
	  conditions.push(`CONCAT(d.first_name, ' ', d.last_name) LIKE '%${director}%'`);
	}
  
	if (conditions.length > 0) {
	  sql += ' WHERE ' + conditions.join(' AND ');
	}
  
	sql += ' GROUP BY m.id, d.id';
  
	// Execute the SQL query
	connection.query(sql, (error, results, fields) => {
		if (error) {
		  console.error(error.message);
		  res.status(500).send('Error searching movies');
		} else {
		  // Process the reviews and split them into an array
		  const processedResults = results.map((result) => ({
			...result,
			reviews: result.reviews ? result.reviews.split(delimiter) : [],
		  }));
		  res.send(processedResults);
		}
	  });
  
	connection.end(); // Close the MySQL connection
  });
  
  
// API endpoint to get genres
app.post('/api/getGenres', (req, res) => {
	let sql = `SELECT distinct mg.genre from movies_genres mg;`; // SQL query to retrieve all movies
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
  
	// Execute the SQL query
	connection.query(sql, (error, results, fields) => {
	  if (error) {
		console.error(error.message); // Log the error message
		res.status(500).send('Error retrieving movies'); // Send an error response
	  } else {
		res.send(results); // Send the query results as the response
	  }
	});
  
	connection.end(); // Close the MySQL connection
  });

  app.post('/api/getRecommendedMovies', (req, res) => {
	const { genres } = req.body;
	console.log('Selected genres:', genres); // Log the selected genres
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
  
	// Build the SQL query to get recommended movies for the selected genres
	let sql = `
	  SELECT 
	  	m.id,
		m.name AS movieTitle,
		mg.genre,
		AVG(r.reviewScore) AS averageRating  -- Use the correct alias for the average rating
	  FROM 
		movies m
	  LEFT JOIN movies_genres mg ON m.id = mg.movie_id
	  LEFT JOIN Review r ON m.id = r.movieID
	`;
  
	let conditions = [];
  
	if (genres && genres.length > 0) {
	  const genreConditions = genres.map((genre) => `mg.genre = '${genre}'`);
	  conditions.push(`(${genreConditions.join(' OR ')})`);
	}
  
	if (conditions.length > 0) {
	  sql += ' WHERE ' + conditions.join(' AND ');
	}
  
	sql += ' GROUP BY m.id, mg.genre, m.name'; // Include the genre and movie title in the GROUP BY clause
	sql += ' ORDER BY averageRating DESC';
	sql += ' LIMIT 10'; // Add the LIMIT clause to get only 10 rows
  
	// Execute the SQL query
	connection.query(sql, (error, results, fields) => {
	  if (error) {
		console.error(error.message);
		res.status(500).send('Error getting recommended movies');
	  } else {
		console.log('Recommended movies:', results); // Log the results before sending them
		res.send(results);
	  }
	});
  
	connection.end(); // Close the MySQL connection
  });
  
  app.post('/api/addToWatchlist', (req, res) => {
	let connection = mysql.createConnection(config);

	let userID = req.body.userID;
	let movieID = req.body.movieID;
	console.log('Received userID:', userID);
	console.log('Received movieID:', movieID);  
  
	let sql = `INSERT INTO watchlist (user_id, movie_id, date_added) VALUES (?, ?, NOW())`;
	let data = [userID, movieID];
  
	connection.query(sql, data, (error, results, fields) => {
	  if (error) {
		return console.error(error.message);
	  }
	  console.log('Received request to add to watchlist:', req.body); // Add this line to check if the endpoint is being called

	  // Successfully added the movie to the watchlist
	  res.send({ success: true });

	});
  
	connection.end();
  });

  // API endpoint to remove a movie from the watchlist
app.post('/api/removeFromWatchlist', (req, res) => {
	const { userID, movieID } = req.body; // Extract userID and movieTitle from the request body
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
  
	// Build the SQL query to remove the movie from the watchlist
	const sql = `DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?`;
	const data = [userID, movieID]; // Assuming the 'watchlist' table has columns 'user_id' and 'movie_id'
  
	// Execute the SQL query
	connection.query(sql, data, (error, results) => {
	  if (error) {
		console.error('Error removing movie from watchlist:', error); // Log the error message
		res.status(500).json({ error: 'Failed to remove movie from watchlist' }); // Send an error response
	  } else {
		console.log('Movie removed from watchlist'); // Log a success message
		res.status(200).json({ success: true }); // Send a success response
	  }
	  connection.end(); // Close the MySQL connection
	});
  });
  

  
  app.post('/api/getUserWatchlist', (req, res) => {
	const { userID } = req.body; // Extract the userID from the request body
	let connection = mysql.createConnection(config); // Create a new MySQL connection using the provided configuration
  
	// Build the SQL query to get the user's watchlist movies
	let sql = `
	  SELECT 
	  	m.id AS movieID,
		m.name AS movieTitle
	  FROM 
		movies m
	  INNER JOIN watchlist w ON m.id = w.movie_id
	  WHERE w.user_id = ?
	`;
  
	connection.query(sql, [userID], (error, results, fields) => {
		if (error) {
		  console.error(error.message);
		  res.status(500).send('Error getting user watchlist');
		} else {
		  const watchlistMovies = results.map((result) => ({
			movieID: result.movieID,
			movieTitle: result.movieTitle,
		  }));
	
		  console.log('User watchlist:', watchlistMovies);
		  res.send(watchlistMovies);
		}
	  });
	
	  connection.end(); // Close the MySQL connection
	});
	
  

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server