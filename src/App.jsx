import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.scss";
import Papa from "papaparse";

import UploadFile from "./UploadFile";

class App extends Component {
   _parseFile(file) {
      console.log("file: ", file);
      Papa.parse(file, {
         complete: (results) => {
            console.log("results: ", results);
         }
      });
   }

   render() {
      return (
         <div className="App">
            <UploadFile
               onChangeAction={this._parseFile}
            />
         </div>
      );
   }
}

export default hot(module)(App);
