import React from "react";
import "./App.css";
import axios from "axios";




export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "", data: [],fetching:false };
  }

  search = () => {
    if(this.state.fetching){
      return
    }

    this.setState({fetching:true})


    axios.get("https://cors-anywhere.herokuapp.com/www.google.fr/search?q=" + this.state.input, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      }
    })
      .then(res => {

        var cheerio = require("cheerio")
        var $ = cheerio.load(res.data);
        var rslts = []

        $("div").each((i, e) => {

          var title = $(e).has("a").find("h3").text()
          var exist = false


          rslts.forEach((value) => {
            if (value.title === title) {
              exist = true
              return
            }
          })

          if (!exist && title !== "" && title!==undefined) {
            var url = $(e).has("a").find("h3").parent().attr("href")

            if (url !== "" && url!==undefined) {
              rslts.push({ title: title, url: url })
            }


          }
        })


        this.setState({ data: rslts,fetching:false })
      })
  }

  render() {
    return (
      <form className="search">
        <h3>GOOGLE</h3>
        <input disabled={this.state.fetching} value={this.state.input} className="search-input" onChange={(event) => { this.setState({ input: event.target.value }); }}>
        </input>
        <button type="submit" disabled={this.state.fetching} className="search-btn" onClick={this.search}>Search</button>



        <div id="content">
          {this.state.data.map((value) => {
            return (
              <div className="result">

                <a href={value.url}>
                  <h3>{value.title}</h3>
                </a>
              </div>
            )
          })}
        </div>



      </form>
    )

  }
}