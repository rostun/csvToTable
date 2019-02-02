import React, { Component } from "react";
import { hot } from "react-hot-loader";
import Papa from "papaparse";

import UploadFile from "./UploadFile";
import AwesomeTable from "./AwesomeTable";
import PaginationBlock from "./PaginationBlock";

import "../sass/App.scss";

//could do: build into interface
const ROWS_PER_PAGE = 50;

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
         data: [],
         numOfPages: 1, 
         currentPage: 1 
      };
   }

   _parseFile(file) {
      Papa.parse(file, {
         complete: results => {
            try {
               this.setState({ 
                  data: results.data,
                  numOfPages: Math.ceil((results.data.length-1)/ROWS_PER_PAGE)
               });
            } catch (error) {
               console.log(error);
            }
         }
      });

      //let read = new FileReader();
      //read.readAsBinaryString(file);
      //read.onloadend = () => { console.log(read.result); }
   }

   _changePage(currentPage) {
      this.setState({
         currentPage: currentPage
      });
   }

   render() {

      return (
         <div className="App">
            <UploadFile onChangeAction={this._parseFile.bind(this)} />
            <PaginationBlock numOfPages={this.state.numOfPages} changePage={this._changePage.bind(this)} />
            <AwesomeTable
               tableData={this.state.data}
               numOfPages={ROWS_PER_PAGE}
               currentPage={this.state.currentPage}
            />
         </div>
      );
   }
}

export default hot(module)(App);
