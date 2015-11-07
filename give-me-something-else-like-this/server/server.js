Meteor.methods({
  fetchSongs: function(query) {
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=LJ8HVOMGHXJHV45NG&combined=" + query, {
         headers: {
             Accept: "application/json"
         }
    });
    console.log(result.data.response.songs[0].title);
    return result;
  }
});
