# MyPage (Recommendations & Watchlist Functionality) README

## User Specifications
- The user shall be able to select their favourite movie genres in a multi-select form, triggered by clicking <i>Get New Recommendations</i>, and then <i>Select Preferred Genres</i>.
- The system shall recommend 10 movies that are within the selected genres using a weighted recommendation algorithm based on the movie's popularity (average user rating), sorted by highest average rating.
- When the user resubmits this form, the recommendation system is run again, providing recommendations that satisfy these new filters
- The user shall be able to add movies from this list of recommendations to their watchlist. The watchlist table stores movies, corresponding to userIDs. If the movie is already in the watchlist of the user (same movie ID and user ID), the movie won't be added to the user's watchlist, and a popup will indicate that the movie is already in the user's watchlist.
- The user can click the <i>My Watchlist</i> buttton to view a list of the movies that they've added to their watchlist, ordered from first to most recently added. They can remove movies from their watchlist within this popup.