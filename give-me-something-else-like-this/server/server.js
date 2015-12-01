var api_key = "LJ8HVOMGHXJHV45NG";
var bucket_id = "7digital-US&bucket";

Meteor.methods({
  fetchSongs: function(query) {
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&combined=" + query + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
        params: {
          results: 1
        },
         headers: {
             Accept: "application/json"
         }
    });
    return result;
  },
  findSimilarSong: function(summary_map) {
    var key;                // (c, c-sharp, d, e-flat, e, f, f-sharp, g, a-flat, a, b-flat, b) 0 - 11
    var energy;             // 0.0 < energy < 1.0
    var liveness;           // 0.0 < liveness < 1.0
    var tempo;              // 0.0 < tempo < 500.0 (BPM)
    var speechiness;        // 0.0 < speechiness < 1.0
    var acousticness;       // 0.0 < acousticness < 1.0
    var instrumentalness;
    var loudness;           // -100.0 < loudness < 100.0 (dB)
    var valence;
    var danceability;       // 0.0 < danceability < 1.0

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

    var e = 0.2;

    // 0.0 < energy < 1.0
    var max_energy = energy + e < 1 ? energy + e : 1;
    var min_energy = energy - e > 0 ? energy - e : 0;
    console.log("energy max: " + max_energy + " min: " + min_energy);

    // 0.0 < liveness < 1.0
    var max_liveness = liveness + e < 1 ? liveness + e : 1;
    var min_liveness = liveness - e > 0 ? liveness - e : 0;
    console.log("liveness max: " + max_liveness + " min: " + min_liveness);

    // 0.0 < tempo < 500.0 (BPM)
    var e_tempo = e * 100;
    var max_tempo = tempo + e_tempo < 500 ? tempo + e_tempo : 500;
    var min_tempo = tempo - e_tempo > 0 ? tempo - e_tempo : 0;
    console.log("tempo max: " + max_tempo + " min: " + min_tempo);

    // 0.0 < speechiness < 1.0
    var max_speechiness = speechiness + e < 1 ? speechiness + e : 1;
    var min_speechiness = speechiness - e > 0 ? speechiness - e : 0;

    // 0.0 < acousticness < 1.0
    var max_acousticness = acousticness + e < 1 ? acousticness + e : 1;
    var min_acousticness = acousticness - e > 0 ? acousticness - e : 0;

    // -100.0 < loudness < 100.0 (dB)
    var e_loudness = e * 50;
    var max_loudness = loudness + e_loudness < 100 ? loudness + e_loudness : 100;
    var min_loudness = loudness - e_loudness > 0 ? loudness - e_loudness : 0;
    console.log("loudness max: " + max_loudness + " min: " + min_loudness);

    // 0.0 < danceability < 1.0
    var max_danceability = danceability + e < 1 ? danceability + e : 1;
    var min_danceability = danceability - e > 0 ? danceability - e : 0;

    // API call
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
        params: {
          results: 1,
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
      console.log("tempo: " + result.data.response.songs[0].audio_summary.tempo);
      console.log("energy: " + result.data.response.songs[0].audio_summary.energy);
      console.log("liveness: " + result.data.response.songs[0].audio_summary.liveness);
      console.log("loudness: " + result.data.response.songs[0].audio_summary.loudness);
    } else {
      console.log("No results found!");
      return null;
    }


    return result;

  }
});
