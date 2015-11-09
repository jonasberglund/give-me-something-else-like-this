var summary_map;

Template.search.helpers({
  searchResult: function () {
    return Session.get('searchResult');
  }
});

Template.search.events({
  'submit .input-group': function (event) {
    event.preventDefault();

    // Get value from input field
    var query = document.getElementById('song-query').value;

    if(query.length == 0) return;

    // Call server method with search query
    Meteor.call('fetchSongs', query, function(err, result){
      if(err){
        return console.log(err);
      }

      // Takes first song from result
      var song = result.data.response.songs[0];

      // Create an array with all information about the song
      summary_map = []
      for (cat in song.audio_summary) {
        summary_map.push({key: cat, value: song.audio_summary[cat]})
      }

      // Pass apropriet information to front end
      Session.set('searchResult', [{
        artist: song.artist_name,
        title: song.title,
        summary: summary_map
      }]);

    });
  },
  'click #find-similar-song': function (event) {
    event.preventDefault();

    Meteor.call('findSimilarSong', summary_map, function(err, result){
      if(err){
        return console.log(err);
      }

      //TODO: Handle response from server
      
    });
  }
});
