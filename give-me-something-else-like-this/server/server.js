var api_key = "LJ8HVOMGHXJHV45NG";
var bucket_id = "7digital-US&bucket";

Meteor.methods({
  fetchSongs: function(song_query, artist_query) {
    var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&title=" + song_query + "&artist=" + artist_query + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
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
    var max_energy;
    var min_energy;
    var max_liveness;
    var min_liveness;
    var max_tempo;
    var min_tempo;
    var max_speechiness;
    var min_speechiness;
    var max_acousticness;
    var min_acousticness;
    var min_valence;
    var max_valence;
    var max_loudness;
    var min_loudness;
    var max_danceability;
    var min_danceability;

    function updateSearchCriterias(){


      // 0.0 < speechiness < 1.0
      var e_s = e * 0.0136;
      max_speechiness = speechiness + e_s < 1 ? speechiness + e_s : 1;
      min_speechiness = speechiness - e_s > 0 ? speechiness - e_s : 0;
      console.log("max_speechiness: " + max_speechiness + " min: " + min_speechiness);

      // 0.0 < danceability < 1.0
      var e_d = e * 0.0566;
      max_danceability = danceability + e_d < 1 ? danceability + e_d : 1;
      min_danceability = danceability - e_d > 0 ? danceability - e_d : 0;
      console.log("max_danceability: " + max_danceability + " min: " + min_danceability);

      // 0.0 < liveness < 1.0
      var e_l = e * 0.1581;
      max_liveness = liveness + e_l < 1 ? liveness + e_l : 1;
      min_liveness = liveness - e_l > 0 ? liveness - e_l : 0;
      console.log("liveness max: " + max_liveness + " min: " + min_liveness);

      var e_e = e * 0.1585;
      // 0.0 < energy < 1.0
      max_energy = energy + e_e < 1 ? energy + e_e : 1;
      min_energy = energy - e_e > 0 ? energy - e_e : 0;
      console.log("energy max: " + max_energy + " min: " + min_energy);

      // 0.0 < acousticness < 1.0
      var e_a = e * 0.2606;
      max_acousticness = acousticness + e_a < 1 ? acousticness + e_a : 1;
      min_acousticness = acousticness - e_a > 0 ? acousticness - e_a : 0;
      console.log("max_acousticness: " + max_acousticness + " min: " + min_acousticness);

      // 0.0 < valence < 1.0
      var e_v = e * 0.2606;
      max_valence = valence + e_v < 1 ? valence + e_v : 1;
      min_valence = valence - e_v > 0 ? valence - e_v : 0;
      console.log("max_valence: " + max_valence + " min: " + min_valence);

      // -100.0 < loudness < 100.0 (dB)
      var e_l = e * 3.7287;
      max_loudness = loudness + e_l < 100 ? loudness + e_l : 100;
      min_loudness = loudness - e_l > -100 ? loudness - e_l : -100;
      console.log("loudness max: " + max_loudness + " min: " + min_loudness);

      // 0.0 < tempo < 500.0 (BPM)
      var e_t = e * 11.3013;
      max_tempo = tempo + e_t < 500 ? tempo + e_t : 500;
      min_tempo = tempo - e_t > 0 ? tempo - e_t : 0;
      console.log("tempo max: " + max_tempo + " min: " + min_tempo);

    }

    // API call
    function apiCall(){
      var result = HTTP.get("http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&bucket=id:" + bucket_id + "=audio_summary&bucket=tracks", {
          params: {
            results: 100,
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
            max_valence: max_valence,
            min_valence: min_valence,
            max_loudness: max_loudness,
            min_loudness: min_loudness,
            max_danceability: max_danceability,
            min_danceability: min_danceability,
          },
          headers: {
             Accept: "application/json"
          }
      });

      return result;
    }

    updateSearchCriterias();
    var result = apiCall();

    // we want at least two results
    while(!result.data.response.songs[1]){
      console.log("No results found!");
      if (result.data.response.songs[0]) {
        console.log(result.data.response.songs[0].title);
      }
      e = e + 0.1;
      updateSearchCriterias();
      var result = apiCall();
    }

    if (result.data.response.songs[0]) {
      console.log(result.data.response.songs[0].title);
      console.log(result.data.response.songs[0].artist_name);
      console.log("tempo: " + result.data.response.songs[0].audio_summary.tempo);
      console.log("energy: " + result.data.response.songs[0].audio_summary.energy);
      console.log("liveness: " + result.data.response.songs[0].audio_summary.liveness);
      console.log("loudness: " + result.data.response.songs[0].audio_summary.loudness);
    }

    return result;

  },

});
