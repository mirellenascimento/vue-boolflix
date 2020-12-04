const API_KEY = 'bbba21a7230b4c2b7a98694c2cb6c828';
const homeMovies= [
  {
    name: 'Now Playing',
    url: 'now_playing'
  },
  {
    name: 'Popular',
    url: 'popular'
  },
  {
    name: 'Top rated',
    url: 'top_rated'
  },
  {
    name: 'Upcoming',
    url: 'upcoming'
  }
];

const languagesList = [
  {
    value: 'en-US',
    image: 'en.svg',
    name: 'English(USA)'
  },
  {
    value: 'it-IT',
    image: 'it.svg',
    name: 'Italian'
  },
  {
    value: 'fr-FR',
    image: 'fr.svg',
    name: 'French'
  },
]

const myApp = new Vue({
  el: '#root',
  data: {
    searchInput: '',
    language: 'it-IT',
    languagesList: [...languagesList],
    movies: [],
    homeMovies: [...homeMovies],
    genreMovies: [],
    showingMovies: '',
    searchPage: 1,
    moviePosterImage: 'https://image.tmdb.org/t/p/w342',


  },

  mounted(){
    axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        'api_key': API_KEY,
        language: this.language,
      }
    }).then(popular => this.movies = popular.data.results);



    axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        'api_key': API_KEY,
        language: this.language,
      }
    }).then(genere => this.genreMovies = genere.data.genres);

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
          // console.log(mov.data.results);
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
          // console.log(this.movies)
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

    //places overview in english when translation is not found TO BE FIXED!!!!!!
    englishOverview(movie){
      let movieId = movie.id;
      let newOverview = '';
      axios.get('https://api.themoviedb.org/3/find', {
        params: {
          external_id: movieId,
          'api_key': API_KEY,
          language: 'en-US',
          external_source: 'imdb_id',
        }
      }).then(overview => newOverview = overview.data.results);
      return movieId
    },

    selectHome(home){
      axios.get(`https://api.themoviedb.org/3/movie/${home.url}`, {
        params: {
          'api_key': API_KEY,
          language: this.language,
        }
      }).then(h => this.movies = h.data.results);
      console.log(this.movies);
    },

    genreFilter(movie){
      return this.genreMovies.filter(e => movie.genre_ids.includes(e.id));
    },

  },

  computed: {

  },



});
