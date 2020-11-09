import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wikiSearchReturnValues: [],
      wikiSearchTerms: ''
    }
 }
  
  resolveUrl = async (pageID) => {
    let urlForRetrievingPageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&pageids=${pageID}&format=json`;
    const response = await fetch(urlForRetrievingPageURLByPageID);
    const responseData = await response.json();
    console.log(responseData)
    const url = responseData.query.pages[pageID].fullurl;
    return (url) ? url : `https://en.wikipedia.org/wiki/${responseData.query.pages[pageID].title}`;
  }
  
  useWikiSearchEngine = async (e) => {
    e.preventDefault();

    // if (this.state.wikiSearchTerms === "") {
    //   return
    // }

    this.setState({
      wikiSearchReturnValues: []

    });
    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
      action: 'query',
      list: 'search',
      srsearch: this.state.wikiSearchTerms,
      format: 'json'
    };

    url = url + '?origin=*';
    Object.keys(params).forEach((key) => {
      url += "&" + key + "=" + params[key];
    });
    console.log("", url)
     
    const response = await fetch(url);
    const responseData = await response.json();

    let newData = [];
    console.log(responseData);
    responseData.query.search.map(async (searchResult) => {
      newData.push({
        queryResultPageFullURL: await this.resolveUrl(searchResult.pageid),
        queryResultPageID: searchResult.pageid,
        queryResultTittle: searchResult.title,
        queryResultSnippet: searchResult.snippet,
      })

      this.setState({
        wikiSearchReturnValues: newData
      });
    })
  }

  changeWikiSearchTerms = (e) => {
    e.preventDefault();
    console.log(this.state.wikiSearchReturnValues)
    this.setState({
      wikiSearchTerms: e.target.value
    });
   
 }

  render() {
    // let wikiSearchResults = [];

    // for (var key3 in this.state.wikiSearchReturnValues) {
    //   wikiSearchResults.push(
    //     <div className="searchResultDiv" key={key3} >
    //       <h3><a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>
    //         {this.state.wikiSearchReturnValues[key3].queryResultPageTitle}</a>
    //       </h3>
    //         <span className='link'><a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>
    //         {this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}
    //       </a></span>
    //       <p className="description" dangerouslySetInnerHTML={{
    //         __html: this.state.wikiSearchReturnValues[key3].queryResultPageSnippet}}></p>
    //     </div>
        
    //   );
    // }

    


    return (
      <div className="App">
        <h1>Darlington N Emeka search engine<webkitConvertPointFromNodeToPage/></h1>
        
        <form action="" onSubmit={this.useWikiSearchEngine}>
          <input type="text" value={this.state.wikiSearchTerms || ''} onChange={this.changeWikiSearchTerms}
            placeholder='Search articles' />
          <button type='submit' onClick={this.useWikiSearchEngine}>Search</button>
        </form>
        {this.state.wikiSearchReturnValues.map(
          (value, key3) => (
            <div className="searchResultDiv" key={key3} >
              <h3><a href={value.queryResultPageFullURL}>
                {value.queryResultPageTitle}</a>
              </h3>
                <span className='link'><a href={value.queryResultPageFullURL}>
                {value.queryResultPageFullURL}
              </a></span>
              <p className="description" dangerouslySetInnerHTML={{
                __html: value.queryResultPageSnippet}}></p>
            </div>
          )
        )}
      </div>
    );
  }
}

export default App;
