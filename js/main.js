const API_KEY = 'bbba21a7230b4c2b7a98694c2cb6c828';

const myApp = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    language: 'it-IT',
    movies: [],
    searchPage: 1,
    moviePosterImage: 'https://image.tmdb.org/t/p/w185',
  },

  mounted(){
    axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        'api_key': API_KEY,
        language: this.language,
      }
    }).then(popular => this.movies = popular.data.results);
  },

  methods:{
    searchMovie(){
      console.log(this.searchInput);
      if (this.searchInput === '') {

      } else {
        axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            'api_key': API_KEY,
            language: this.language,
            query: this.searchInput,
            page: this.searchPage,
          }
        }).then(mov => {
          this.movies = mov.data.results
          console.log(mov.data.results);
        });

        axios.get('https://api.themoviedb.org/3/search/tv', {
          params: {
            'api_key': API_KEY,
            language: this.language,
            query: this.searchInput,
            page: this.searchPage,
          }
        }).then(tv => {
          tv.data.results.forEach(movie => this.movies.push(movie));
          console.log(tv.data.results);
          console.log(this.movies)
        });
      };
    },

    // Tranforms vote from 1 to 10 into 1 to 5 stars
    ratingStars(vote){
      return Math.ceil(vote/2);
    },

    //image to show when flag is not found
    errorFlag(e){
        e.target.src = 'https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'
    },

  },

  computed: {
  },



});
