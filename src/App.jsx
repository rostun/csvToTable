import React, { Component } from "react";
import { hot } from "react-hot-loader";
import "./App.scss";

import UploadFile from "./UploadFile";

class App extends Component {
   _uploadFile(file) {
      console.log(file);
   }

   render() {
      return (
         <div className="App">
            <UploadFile
               onChangeAction={this._uploadFile}
            />
         </div>
      );
   }
}

export default hot(module)(App);
