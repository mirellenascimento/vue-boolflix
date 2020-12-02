const API_KEY = 'bbba21a7230b4c2b7a98694c2cb6c828';

const myApp = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    language: 'it-IT',
    searchMovies: [],
    movieImage: 'https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png',
  },
  methods:{
    searchMovie(){
      console.log(this.searchInput);
      if (this.searchInput === '') {

      } else {
        axios.get('https://api.themoviedb.org/3/search/multi', {
          params: {
            'api_key': API_KEY,
            language: this.language,
            query: this.searchInput,
          }
        }).then(r => {
          console.log(r.data.results)
          this.searchMovies = r.data.results
        });
      };
    },
  },
});
