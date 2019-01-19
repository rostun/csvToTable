import React, { Component } from "react";
import { hot } from "react-hot-loader";
import Papa from "papaparse";

import UploadFile from "./UploadFile";
import AwesomeTable from "./AwesomeTable";
import '../sass/App.scss';

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
         data: []
      };
   }

   _parseFile(file) {
      Papa.parse(file, {
         complete: results => {
            try {
               this.setState({ data: results.data });
            } catch (error) {
               console.log(error);
            }
         }
      });

      //let read = new FileReader();
      //read.readAsBinaryString(file);
      //read.onloadend = () => { console.log(read.result); }
   }

   render() {
      return (
         <div className="App">
            <UploadFile onChangeAction={this._parseFile.bind(this)} />
            <AwesomeTable data={this.state.data} />
         </div>
      );
   }
}

export default hot(module)(App);
