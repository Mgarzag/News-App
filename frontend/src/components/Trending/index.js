import React from 'react'
import axios from "axios";

class Trending extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            trendingTopics: []
        }
    }

    componentDidMount(){
        const options = {
            method: 'GET',
            url: 'https://bing-news-search1.p.rapidapi.com/news/trendingtopics',
            params: {textFormat: 'Raw', safeSearch: 'Off'},
            headers: {
              'x-bingapis-sdk': 'true',
              'x-rapidapi-key': 'dd33973374msh18e1f38202fc6b6p1723d7jsnae5cbbd26186',
              'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com'
            }
          };
          
          axios.request(options).then( (response) => {
              console.log(response.data)
              this.setState({
                  trendingTopics: response.data.value
              })
          }).catch(function (error) {
              console.error(error);
          });
          console.log(this.state.trendingTopics)
    }

    render() {
        return(
        <div className="items">
        {this.state.trendingTopics.map((item) => (
          <p className="item">{item.name}</p>
          
        ))}
        
      </div>
      )
    }
}





export default Trending