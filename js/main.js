const API_KEY = 'bbba21a7230b4c2b7a98694c2cb6c828';
const homeMovies= [
  {
    name: 'Top rated',
    url: 'top_rated',
    movies: [],
    movieIndex: 1
  },
  {
    name: 'Popular',
    url: 'popular',
    movies: [],
    movieIndex: 1
  },
  {
    name: 'Now Playing',
    url: 'now_playing',
    movies: [],
    movieIndex: 1
  },
  {
    name: 'Upcoming',
    url: 'upcoming',
    movies: [],
    movieIndex: 1
  }
];

const languagesList = [
  {
    value: 'en-US',
    name: 'English',
  },
  {
    value: 'it-IT',
    name: 'Italian',

  },
  {
    value: 'fr-FR',
    name: 'French',
  },
  {
    value: 'pt-BR',
    name: 'Português',
  },
]

const myApp = new Vue({
  el: '#root',
  data: {

    // setting home-page
    language: 'it-IT',
    languagesList: [...languagesList],
    homeMovies: [...homeMovies],
    homeIndex: 1,

    //general settings
    moviePosterImage: 'https://image.tmdb.org/t/p/w342',
    genreMovies: [],

    //first colunm
    movies: [],

    //searching movies and tv series
    tvSeries: [],
    searchInput: '',
    searchIndex: 1,
  },

  mounted(){

    //sets menu and movies at colunms
    this.moviesList();

    //uploads all available genres used of movies info
    this.setGenre()

    // toogles between standats and sticky menu
    window.onscroll = () => {
      let navbar = document.getElementById("header");
      let base = document.getElementById("header-base");
      let sticky = base.offsetTop;

      if (window.pageYOffset > sticky) {
        navbar.classList.add("active");
        base.classList.add("inactive")

      } else {
        navbar.classList.remove("active");
        base.classList.remove("inactive")
      }
    };
  },

  methods:{
    //searches for a movie or TV serie
    searchMovie(){
      if (this.searchInput === '') {

      } else {
        axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            'api_key': API_KEY,
            language: this.language,
            query: this.searchInput,
            page: this.searchIndex,
          }
        }).then(mov => {
          this.movies = mov.data.results

          axios.get('https://api.themoviedb.org/3/search/tv', {
            params: {
              'api_key': API_KEY,
              language: this.language,
              query: this.searchInput,
              page: this.searchIndex,
            }
          }).then(tv => {
            this.tvSeries = tv.data.results

            this.tvInfo();
            for (var i = 0; i < this.tvSeries.length; i++) {
              this.movies.push(this.tvSeries[i]);
            }
          });

        });


        document.getElementById('search-results').innerHTML = `
        <div class="col-12 title-list">
          <h3>Results for:<br>${this.searchInput}</h3>
        </div>`;

        document.getElementById('next-search').innerHTML = `
        <div>
          <span><i class="fas fa-chevron-right fa-5x"></i></span>
        </div>`;
      };
    },

    //on search results, shows previous page of movies when < is clicked
    searchPrev(){
      this.searchIndex--;
      this.searchMovie();
      this.$nextTick(function(){
        scrollRight("search_display");
      });
    },

    //on search results, shows next page of movies when > is clicked
    searchNext(){
      this.searchIndex++;
      this.searchMovie();
      this.$nextTick(function(){
        scrollLeft("search_display");
      });
    },

    //press enter to search
    searchEnter(event){
  		if (event.which === 13){
  			this.searchMovie();
  		};
    },

    //generate lists of movies
    moviesList(){
      for (let i = 0; i < this.homeMovies.length; i++) {
        axios.get(`https://api.themoviedb.org/3/movie/${this.homeMovies[i].url}`, {
          params: {
            'api_key': API_KEY,
            language: this.language,
            page: this.homeIndex,

          }
        }).then(now => {
          this.homeMovies[i].movies = now.data.results;
        });
      }
    },

    //shows previous page of movies when < is clicked
    prev(home){
      home.movieIndex--;

      axios.get(`https://api.themoviedb.org/3/movie/${home.url}`, {
        params: {
          'api_key': API_KEY,
          language: this.language,
          page: home.movieIndex,

        }
      }).then(now => {
        home.movies = now.data.results;
      });

      this.$nextTick(function(){
        scrollRight(home.url);
      });

    },

    //shows next page of movies when > is clicked
    next(home){
      home.movieIndex++;

      axios.get(`https://api.themoviedb.org/3/movie/${home.url}`, {
        params: {
          'api_key': API_KEY,
          language: this.language,
          page: home.movieIndex,

        }
      }).then(now => {
        home.movies = now.data.results;
      });

      this.$nextTick(function(){
        scrollLeft(home.url);
      });

    },

    scrollToList(chosenList){
      let list = document.getElementById(chosenList);
      list.scrollIntoView();
    },

    changeLanguage(){
      this.moviesList();
      this.setGenre();
      this.searchMovie();

    },

    // Tranforms vote from 1 to 10 into 1 to 5 stars
    ratingStars(vote){
      return Math.ceil(vote/2);
    },

    //flag image to show when flag is not found
    errorFlag(f){
        f.target.src = 'img/boolflixworld.png'
    },

    //poster image to show when flag is not found
    errorPoster(p){
        p.target.src = 'img/boolflixposter.png'
    },

    //uploads all available genres used of movies info
    setGenre(){
      axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          'api_key': API_KEY,
          language: this.language,
          page: this.homeIndex,

        }
      }).then(genere => this.genreMovies = genere.data.genres);
    },

    //filters the genres for each movie
    genreFilter(movie){
      return this.genreMovies.filter(e => movie.genre_ids.includes(e.id));
    },

    //changes the keys on tv objects to match wit movies
    tvInfo(){
      this.tvSeries = this.tvSeries.map(function(obj) {
          obj['title'] = obj['name']; // Assign new key
          delete obj['name']; // Delete old key

          obj['original_title'] = obj['original_name']; // Assign new key
          delete obj['original_name']; // Delete old key

          obj['release_date'] = obj['first_air_date']; // Assign new key
          delete obj['first_air_date']; // Delete old key



          return obj;
      });
    },

  },
});
