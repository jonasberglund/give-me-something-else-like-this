var summary_map;

Template.search.helpers({
  searchResult: function () {
    return Session.get('searchResult');
  }
});

Template.search.events({
  'submit .input-group': function (event) {
    event.preventDefault();

    var query = document.getElementById('song-query').value;

    console.log('Search: ' + query);
    if(query.length == 0) return;

    Meteor.call('fetchSongs', query, function(err, result){
      if(err){
        return console.log(err);
      }

      console.log(result.data.response);
      var song = result.data.response.songs[0];

      summary_map = []
      for (cat in song.audio_summary) {
        summary_map.push({key: cat, value: song.audio_summary[cat]})
      }

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
    });
  }
});
