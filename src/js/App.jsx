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
         template: {},
         numOfPages: 1,
         currentPage: 1
      };
   }

   _createTemplate(row) {
      //this will contain the indices of interest
      let _numTemplate = {}; //(numbers)
      let _textTemplate = {}; //(text)

      for (let i = 0; i < row.length; i++) {
         this._isNumber(row[i])
            ? (_numTemplate[i + 1] = {}) //to account for is column
            : (_textTemplate[i + 1] = {});
      }
      return { numTemplate: _numTemplate, textTemplate: _textTemplate };
   }

   _convertNumberString(cellString) {
      return cellString * 1;
   }

   _isNumber(cellString) {
      const _cellValue = cellString * 1;
      return !isNaN(_cellValue);
   }

   _processData(data) {
      data.forEach(row => {
         row.forEach((cell, idx) => {
            if (this._isNumber(cell)) {
               row[idx] = this._convertNumberString(cell);
            }
         });
      });

      return data;
   }

   _parseFile(file) {
      Papa.parse(file, {
         complete: results => {
            try {
               const _data = this._processData(results.data);
               const _template = this._createTemplate(_data[1]); //second row

               this.setState({
                  data: _data,
                  template: _template,
                  numOfPages: Math.ceil(
                     (results.data.length - 1) / ROWS_PER_PAGE
                  )
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
            <PaginationBlock
               numOfPages={this.state.numOfPages}
               changePage={this._changePage.bind(this)}
            />
            <AwesomeTable
               tableData={this.state.data}
               template={this.state.template}
               numOfPages={ROWS_PER_PAGE}
               currentPage={this.state.currentPage}
            />
         </div>
      );
   }
}

export default hot(module)(App);
