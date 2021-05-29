import {Component, React} from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class App extends Component {
  state = {
    videoListFromAPI: [],
    currentVideoList: []
  }

  getVideosList = async () =>  {
    const videos = await axios.get('/api/videos');
    this.setState({videoListFromAPI: videos.data.data.slice(), currentVideoList: videos.data.data.slice()});
  }

  componentDidMount() {
    this.getVideosList();
  }

  generateVideoList =()=>{
    const videosJSX = this.state.currentVideoList.map(video=>{
      return (
        <div class="col-auto mb-3">
          <div class="card" style={{"width": "16rem"}}>
            <img class="card-img-top" src={video.thumbnails.medium.url} alt="Card image cap"/>
            <div class="card-body">
              <p class="card-title">{video.title}</p>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div class="container mt-4">
        <div class="row">
          {videosJSX}        
        </div>
      </div>
      );
  }

  render () {
    return (
      <div className="jumbotron">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Youtube Query API</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Filters (Sort By)
                  </a>
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                    <li><button class="dropdown-item" onClick={this.sortByTitle}>Title</button></li>
                    <li><button class="dropdown-item" onClick={this.sortByPublishedDate}>Published Date</button></li>
                    <li><button class="dropdown-item" onClick={this.reset}>Reset</button></li>
                  </ul>
                </li>
              </ul>
              <form class="form-inline ms-auto">
                <input id="input" class="form-control mr-sm-2" style={{"display":"inline","width":"75%","margin-right":"10px"}} type="search" placeholder="Search" aria-label="Search"/>
                 <button class="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.searchQuery}>Search</button>
              </form>
            </div>
          </div>
        </nav>
        {this.state.currentVideoList.length > 0?
        this.generateVideoList()
        :null}
      </div>
    )
  }

  sortByTitle = () => {
    let {currentVideoList} = this.state;
    currentVideoList.sort((a, b) => a.title.localeCompare(b.title));
    this.setState({currentVideoList});
  } 

  sortByPublishedDate = () => {
    let {currentVideoList} = this.state;
    currentVideoList.sort(function(a,b){
      return new Date(b.publishTime) - new Date(a.publishTime);
    });
    this.setState({currentVideoList});
  } 

  reset = () => {
    this.setState({currentVideoList: this.state.videoListFromAPI.slice()});
  } 

  searchQuery = async (event)=> {
    event.preventDefault();
    const query = document.getElementById("input").value;
    document.getElementById("input").value = '';
    const queryVideoList = await axios.get(`/api/videos/search?q=${query}&page=1&limit=200`); 
    this.setState({currentVideoList: queryVideoList.data.data.slice()});
  }
}

export default App;
