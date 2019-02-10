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

   _isNumber(cellString) {
      const _cellValue = cellString * 1;
      return !isNaN(_cellValue);
   }

   _numberRows(tableData) {
      if (!tableData || tableData.length === 0) {
         return [];
      }

      tableData = tableData.map((row, idx) => {
         row.unshift(idx);
         return row;
      });

      return tableData;
   }

   _convertNumberString(cellString) {
      return cellString * 1;
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

   _calculateRowsPerPage(numOfRows) {
      return Math.ceil((numOfRows - 1) / ROWS_PER_PAGE);
   }

   _parseFile(file) {
      Papa.parse(file, {
         complete: results => {
            try {
               let _data = this._processData(results.data);
               _data = this._numberRows(_data);

               this._setAppData(_data);
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

   _setAppData(data) {
      this.setState({
         data: data,
         numOfPages: this._calculateRowsPerPage(data.length)
      });
   }

   _changeNumOfPages(numOfRows) {
      this.setState({
         numOfPages: this._calculateRowsPerPage(numOfRows)
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
               rowsPerPage={ROWS_PER_PAGE}
               currentPage={this.state.currentPage}
               changePagination={this._changeNumOfPages.bind(this)}
            />
         </div>
      );
   }
}

export default hot(module)(App);
