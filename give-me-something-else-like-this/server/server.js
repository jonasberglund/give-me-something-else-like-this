Meteor.methods({
  fetchSongs: function(query) {
    var api_key = "LJ8HVOMGHXJHV45NG";
    var results = 1;
    var bucket_id = "7digital-US&bucket";
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&results=" + results + "&combined=" + query + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
         headers: {
             Accept: "application/json"
         }
    });
    return result;
  }
});
