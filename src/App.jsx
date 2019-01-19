import React, { Component } from "react";
import { hot } from "react-hot-loader";
import Papa from "papaparse";

import UploadFile from "./UploadFile";
import AwesomeTable from "./AwesomeTable";
import "./App.scss"
;
class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
      };
   }

   _parseFile(file) {
      console.log("file: ", file);
      Papa.parse(file, {
         complete: (results) => {
            console.log("results: ", results);
         }
      });

      //let read = new FileReader();
      //read.readAsBinaryString(file);
      //read.onloadend = () => { console.log(read.result); }
   }

   render() {
      return (
         <div className="App">
            <UploadFile
               onChangeAction={this._parseFile}
            />
            <AwesomeTable
               data={this.state.data}
            />
         </div>
      );
   }
}

export default hot(module)(App);
