var summary_map;
var original_song;

Template.search.helpers({
  searchResult: function () {
    return Session.get('searchResult');
  },
  similarResult: function () {
    return Session.get('similarResult');
  }
});

Template.search.events({
  'submit .input-group': function (event) {
    event.preventDefault();

    // Get value from input field
    var song_query = document.getElementById('song-query').value;
    var artist_query = document.getElementById('artist-query').value;

    if(song_query.length == 0 || artist_query.length == 0) return;

    // Call server method with search query
    Meteor.call('fetchSongs', song_query, artist_query, function(err, result){
      if(err){
        return console.log(err);
      }

      // Takes first song from result
      var song = result.data.response.songs[0];

      original_song = song;

      // Create an array with all information about the song
      summary_map = []
      for (cat in song.audio_summary) {
        if (cat !== "analysis_url" && cat !== "instrumentalness" && cat !== "mode" && cat !== "time_signature" && cat !== "audio_md5" && cat !== "duration" && cat !== "key") {
          summary_map.push({key: cat, value: song.audio_summary[cat]})
        }
      }

      // Reset similar result
      Session.set('similarResult', []);

      // Pass apropriet information to front end
      Session.set('searchResult', [{
        artist: song.artist_name,
        title: song.title,
        extras: song.tracks[0],
        summary: summary_map
      }]);

    });
  },
  'click #find-similar-song': function (event) {
    event.preventDefault();

    Meteor.call('findSimilarSong', summary_map, function(err, result){
      if(err){
        Session.set('similarResult', [{
          error: err.message
        }]);
        return console.log(err);
      }
      else if (!result) {
        Session.set('similarResult', [{
          error: "No result found"
        }]);
        return console.log("No result found!");
      }


      function checkSimilarity(songs){
        var best_song_index = 0;
        var lowest_diff = 1;
        for (var i = 0; i < songs.length; i++) {
          var song = songs[i];
          if (song.title !== original_song.title){
            var this_speechiness = song.audio_summary.valence;
            var original_speechiness = original_song.audio_summary.valence;
            var diff = Math.abs(original_speechiness - this_speechiness)
            if (diff < lowest_diff){
              lowest_diff = diff;
              best_song_index = i;
            }
          }
        }
        return best_song_index;
      }

      // Takes best song from result
      var best_index = checkSimilarity(result.data.response.songs);
      var song = result.data.response.songs[best_index];

      // Create an array with all information about the song
      var summary_map_result = []
      for (cat in song.audio_summary) {
        if (cat !== "analysis_url" && cat !== "instrumentalness" && cat !== "mode" && cat !== "time_signature" && cat !== "audio_md5" && cat !== "duration" && cat !== "key") {
          summary_map_result.push({key: cat, value: song.audio_summary[cat]})
        }
      }

      // Handle response from server
      Session.set('similarResult', [{
        artist: song.artist_name,
        title: song.title,
        extras: song.tracks[0],
        summary: summary_map_result
      }]);

    });
  }
});
