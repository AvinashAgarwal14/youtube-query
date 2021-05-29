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
    this.setState({videoListFromAPI: videos.data.data, currentVideoList: videos.data.data});
  }

  componentDidMount() {
    this.getVideosList();
  }

  render () {
    return (
      <div className="jumbotron">
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="#">Youtube Query</a>
              <ul class="navbar-nav mr-auto">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown
                  </a>    
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </div>
                </li>
              </ul>
        </nav>
        {this.state.currentVideoList.length > 0?
        this.generateVideoList()
        :null}
      </div>
    )
  }

  generateVideoList =()=>{
    const videosJSX = this.state.currentVideoList.map(video=>{
      return (
        <div class="col-auto mb-3">
          <div class="card" style={{"width": "16rem"}}>
            <img class="card-img-top" src={video.thumbnails.default.url} alt="Card image cap"/>
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

}

export default App;
