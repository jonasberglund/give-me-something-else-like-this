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

    // Try to find a song with matching energy
    var max_energy = energy + e;
    var min_energy = energy - e;
    console.log("max: " + max_energy + "min: " + min_energy);

    var max_liveness = liveness + e;
    var min_liveness = liveness -e;
    console.log("max: " + max_liveness + "min: " + min_liveness);

    // Temp
    var max_tempo = tempo + e;
    var min_tempo = tempo - e;
    console.log("max: " + max_tempo + "min: " + min_tempo);

    var max_speechiness = speechiness;
    var min_speechiness = speechiness;

    var max_acousticness = acousticness + e;
    var min_acousticness = acousticness;

    var max_loudness = loudness + e;
    var min_loudness = loudness;

    var max_danceability = danceability + e;
    var min_danceability = danceability;

    // API call
    var api_key = "LJ8HVOMGHXJHV45NG";
    var results = 1;
    var bucket_id = "7digital-US&bucket";
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&results=" + results + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
        params: {
          max_energy: max_energy,
          min_energy: min_energy,
          max_liveness: max_liveness,
          min_liveness: min_liveness,
          max_tempo: max_tempo,
          min_tempo: min_tempo,
          max_speechiness: max_speechiness,
          min_speechiness: min_speechiness,
          max_acousticness: max_acousticness,
          min_acousticness: min_acousticness,
          max_loudness: max_loudness,
          min_loudness: min_loudness,
          max_danceability: max_danceability,
          min_danceability: min_danceability
        },
        headers: {
           Accept: "application/json"
        }
    });

    if (result.data.response.songs[0]) {
      console.log(result.data.response.songs[0].title);
      console.log(result.data.response.songs[0].artist_name);
      console.log(result.data.response.songs[0].audio_summary.tempo);
      console.log(result.data.response.songs[0].audio_summary.energy);
    } else {
      console.log("no results found!");
    }


    return result;

  }
});
