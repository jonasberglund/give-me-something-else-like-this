if (Meteor.isClient) {
  Template.search.helpers({
    searchResult: function () {
      console.log(';akdjhakjsdhakjsdh');
      return Session.get('searchResult');
    }
  });

  Template.search.events({
    //'input [name="song-query"]': function (e) {
    //'click #search-button': function (e) {
    'submit .input-group': function (event) {
      event.preventDefault();

      var query = document.getElementById('song-query').value;

      console.log('Search: ' + query);
      if(query.length == 0) return;

      Meteor.call('fetchSongs', query, function(err, result){
        if(err){
          return console.log(err);
        }

        console.log(result.data.response.songs[0].title);

        Session.set('searchResult', [{
          artist: result.data.response.songs[0].artist_name,
          title: result.data.response.songs[0].title
        }]);

      });
     }
  });
}