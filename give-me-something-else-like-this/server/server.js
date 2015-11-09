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
  },
  findSimilarSong: function(summary_map) {
    var key;
    var energy;
    var liveness;
    var tempo;
    var speechiness;
    var acousticness;
    var instrumentalness;
    var loudness;
    var valence;
    var danceability;

    // Create varibles from object values
    for (var index in summary_map) {
      var obj = summary_map[index];
      if (obj['key'] == 'key') { key = obj['value']; }
      else if (obj['key'] == 'energy') { energy = obj['value']; }
      else if (obj['key'] == 'liveness') { liveness = obj['value']; }
      else if (obj['key'] == 'tempo') { tempo = obj['value']; }
      else if (obj['key'] == 'speechiness') { speechiness = obj['value']; }
      else if (obj['key'] == 'acousticness') { acousticness = obj['value']; }
      else if (obj['key'] == 'instrumentalness') { instrumentalness = obj['value']; }
      else if (obj['key'] == 'loudness') { loudness = obj['value']; }
      else if (obj['key'] == 'valence') { valence = obj['value']; }
      else if (obj['key'] == 'danceability') { danceability = obj['value']; }
    }

    var e = 0.1;

    // Try to find a song with matching tempo
    var max_tempo = tempo + e;
    var min_tempo = tempo - e;
    console.log("max: " + max_tempo + "min: " + min_tempo);

    // Energy
    var max_energy = energy + e;
    var min_energy = energy - e;
    console.log("max: " + max_energy + "min: " + min_energy);

    // API call
    var api_key = "LJ8HVOMGHXJHV45NG";
    var results = 1;
    var bucket_id = "7digital-US&bucket";
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&results=" + results + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
        params: {
          max_tempo: max_tempo,
          min_tempo:  min_tempo,
          max_energy: max_energy,
          min_energy:  min_energy
        },
        headers: {
           Accept: "application/json"
        }
    });
    
    console.log(result.data.response.songs[0].title);
    console.log(result.data.response.songs[0].artist_name);
    console.log(result.data.response.songs[0].audio_summary.tempo);
    console.log(result.data.response.songs[0].audio_summary.energy);
    return result;

  }
});
