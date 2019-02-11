import React, { Component } from "react";
import PropTypes from "prop-types";

import SummaryStats from "./SummaryStats";
import FilterBlock from "./FilterBlock";

class AwesomeTable extends Component {
   constructor(props) {
      super(props);

      this.headerRow = []; //header
      this.bodyRows = []; //keeps track of original body data
      this.typeTracker = {}; //text or number column information
      this.filterTracker = []; //filter column information

      this.state = {
         bodyRowsFiltered: [],
         currentColumn: 0 //our current column selected
      };
   }

   componentDidMount() {
      this.setState({
         bodyRowsFiltered: this._setParams(this.props.tableData)
      });
   }

   componentDidUpdate(prevProps) {
      if (this.props.tableData !== prevProps.tableData) {
         this.setState({
            bodyRowsFiltered: this._setParams(this.props.tableData)
         });
      }
   }

   _setParams(tableData) {
      if (tableData.length === 0) {
         return [];
      }

      this.headerRow = tableData[0];

      if (tableData.length === 1) {
         return [];
      }

      this.bodyRows = Object.assign([], tableData);
      this.bodyRows.shift();

      return Object.assign([], this.bodyRows);
   }

   _createTemplate(row) {
      //this will contain the indices of interest
      let _numTemplate = {}; //(numbers)
      let _textTemplate = {}; //(text)

      for (let i = 1; i < row.length; i++) {
         this._isNumber(row[i])
            ? (_numTemplate[i] = {}) //to account for is column
            : (_textTemplate[i] = {});
      }
      return { numTemplate: _numTemplate, textTemplate: _textTemplate };
   }

   _isNumber(cellString) {
      const _cellValue = cellString * 1;
      return !isNaN(_cellValue);
   }

   _convertNumberString(cellString) {
      return cellString * 1;
   }

   _numSort(idx) {
      return (a, b) => a[idx] - b[idx];
   }

   _textSort(idx) {
      return (a, b) => {
         if (a[idx] < b[idx]) return -1;
         if (a[idx] > b[idx]) return 1;
         return 0;
      };
   }

   _sortColumn(bodyRows, bodyRowsFiltered, template, e) {
      let _id = e.target.id;
      const _current = this.state.currentColumn;
      const _nums = template.numTemplate;
      const _texts = template.textTemplate;

      //new column clicked
      if (
         (_id in _nums && _current === null) ||
         _current !== _id ||
         _id === 0
      ) {
         bodyRowsFiltered.sort(this._numSort(_id));
         bodyRows.sort(this._numSort(_id));
      }
      if ((_id in _texts && _current === null) || _current !== _id) {
         bodyRowsFiltered.sort(this._textSort(_id));
         bodyRows.sort(this._textSort(_id));
      }
      //same column clicked
      if (_id === _current) {
         bodyRowsFiltered.reverse();
         bodyRows.reverse();
         _id = null;
      }

      this.setState({
         currentColumn: _id
      });
   }

   _filterTable(
      bodyRows,
      filterTracker,
      changePagination,
      input,
      specialInput,
      type,
      col
   ) {
      filterTracker[col] = { input, specialInput };

      //user may delete, so reset
      let _bodyRowsFiltered = Object.assign([], bodyRows);

      filterTracker.forEach((value, idx) => {
         //if inputs are empty we don't need to filter
         if (value.input !== "") {
            _bodyRowsFiltered = this._normalFilter(
               _bodyRowsFiltered,
               value.input,
               idx
            );
         }
         if (value.specialInput !== "") {
            _bodyRowsFiltered = this._specialFilter(
               _bodyRowsFiltered,
               value.specialInput,
               idx,
               type
            );
         }
      });

      //reset pagination
      changePagination(_bodyRowsFiltered.length);

      this.setState({
         bodyRowsFiltered: _bodyRowsFiltered
      });
   }

   _normalFilter(bodyRowsFiltered, value, idx) {
      return bodyRowsFiltered.filter(
         row =>
            row[idx]
               .toString()
               .toLowerCase()
               .indexOf(value) >= 0
      );
   }

   _specialFilter(bodyRowsFiltered, value, idx, type) {
      //if it's a text filter
      if (type === "text") {
         return this._specialTextFilter(bodyRowsFiltered, value, idx);
      } else {
         return this._specialNumberFilter(bodyRowsFiltered, value, idx);
      }
   }

   _specialTextFilter(bodyRowsFiltered, value, idx) {
      let _value = value
         .split("")
         .sort()
         .join("");

      return bodyRowsFiltered.filter(row => {
         // get the sentence and the match flag to false
         let _rowValue = row[idx].toLowerCase();
         let _words = _rowValue.split(" ");
         let _match = false;
         // go through each word and if we have an anagram
         for (let i = 0; i < _words.length; i++) {
            if (
               _words[i]
                  .split("")
                  .sort()
                  .join("") === _value
            ) {
               _match = true;
               break;
            }
         }
         return _match;
      });
   }

   _specialNumberFilter(bodyRowsFiltered, value, idx) {
      let _range = "..";
      let _lessThan = "<";
      let _moreThan = ">";

      let _expression = [];

      //if it contains a character of interest, split the string
      if (
         value.indexOf(_range) !== -1 &&
         value.indexOf(_lessThan) === -1 &&
         value.indexOf(_moreThan) === -1
      ) {
         _expression = value.split(_range);
         //if lengths are correct, test if strings are numbers
         if (
            _expression.length === 2 &&
            this._isNumber(_expression[0]) &&
            this._isNumber(_expression[1])
         ) {
            let _lower = this._convertNumberString(_expression[0]);
            let _upper = this._convertNumberString(_expression[1]);
            return bodyRowsFiltered.filter(row => {
               return row[idx] > _lower && row[idx] < _upper;
            });
         }
      }
      //less than
      if (
         value[0] === _lessThan &&
         value.indexOf(_moreThan) === -1 &&
         value.indexOf(_range) === -1
      ) {
         _expression = value.split(_lessThan);
         if (_expression.length === 2 && this._isNumber(_expression[1])) {
            let _upper = this._convertNumberString(_expression[1]);
            return bodyRowsFiltered.filter(row => {
               return row[idx] < _upper;
            });
         }
      }
      //more than
      if (
         value[0] === _moreThan &&
         value.indexOf(_lessThan) === -1 &&
         value.indexOf(_range) === -1
      ) {
         _expression = value.split(_moreThan);
         if (_expression.length === 2 && this._isNumber(_expression[1])) {
            let _lower = this._convertNumberString(_expression[1]);
            return bodyRowsFiltered.filter(row => {
               return row[idx] > _lower;
            });
         }
      }

      //not a valid input
      return bodyRowsFiltered;
   }

   _renderSearchRow(bodyRows, filterTracker, typeTracker, changePagination) {
      let _searchRow = [];

      for (let i = 0; i < bodyRows[0].length; i++) {
         let _type = i in typeTracker.textTemplate ? "text" : "number";
         _searchRow.push(
            <td key={`search-cell${i}`}>
               <FilterBlock
                  id={i}
                  key={`searchBlock-${i}`}
                  type={_type}
                  onChangeAction={this._filterTable.bind(
                     this,
                     bodyRows,
                     filterTracker,
                     changePagination
                  )}
               />
            </td>
         );
      }

      return _searchRow;
   }

   _renderCell(row, keyName, tag, onClick) {
      const CustomTag = tag;

      return row.map((cell, idx) => {
         return (
            <CustomTag id={idx} key={`${keyName}-${idx}`} onClick={onClick}>
               {cell}
            </CustomTag>
         );
      });
   }

   _renderTableBody(
      bodyRows,
      bodyRowsFiltered,
      filterTracker,
      typeTracker,
      rowsPerPage,
      currentPage,
      changePagination
   ) {
      const _startIdx = (currentPage - 1) * rowsPerPage;
      const _endIdx = _startIdx + rowsPerPage;
      const _idxLimit = bodyRowsFiltered.length;

      let _bodyCols = [];

      const _searchRow = this._renderSearchRow(
         bodyRows,
         filterTracker,
         typeTracker,
         changePagination
      );

      _bodyCols.push(<tr key="bodyRow-search">{_searchRow}</tr>);

      for (let i = _startIdx; i < _endIdx; i++) {
         if (i === _idxLimit) {
            break;
         } //if we reached the limit, we're on the last page

         _bodyCols.push(
            <tr key={`bodyRow-${i}`} title={`Row ${i}`}>
               {this._renderCell(bodyRowsFiltered[i], "bodyCell", "td")}
            </tr>
         );
      }

      return <tbody>{_bodyCols}</tbody>;
   }

   _renderTableHead(headerRow, bodyRows, bodyRowsFiltered, template) {
      const _headerCols = this._renderCell(
         headerRow,
         "headerCell",
         "th",
         this._sortColumn.bind(this, bodyRows, bodyRowsFiltered, template)
      );

      return (
         <thead>
            <tr title={"row 0"}>{_headerCols}</tr>
         </thead>
      );
   }

   render() {
      let _bodyRows = this.bodyRows;

      if (!_bodyRows || _bodyRows.length === 0) {
         return <div className="uploadSomeData">No Data</div>;
      }

      //reset template on table rerender
      this.typeTracker = this._createTemplate(_bodyRows[0]);

      return (
         <table className="AwesomeTable">
            {this._renderTableHead(
               this.headerRow,
               this.bodyRows,
               this.state.bodyRowsFiltered,
               this.typeTracker
            )}
            {this._renderTableBody(
               this.bodyRows,
               this.state.bodyRowsFiltered,
               this.filterTracker,
               this.typeTracker,
               this.props.rowsPerPage,
               this.props.currentPage,
               this.props.changePagination
            )}
            <SummaryStats
               bodyData={this.state.bodyRowsFiltered}
               template={this.typeTracker}
               numColumns={this.headerRow.length}
            />
         </table>
      );
   }
}

AwesomeTable.propTypes = {
   tableData: PropTypes.array.isRequired,
   rowsPerPage: PropTypes.number.isRequired,
   currentPage: PropTypes.number.isRequired,
   changePagination: PropTypes.func.isRequired
};

export default AwesomeTable;
