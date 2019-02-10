import React, { Component } from "react";
import PropTypes from "prop-types";

import "../sass/AwesomeTable.scss";
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
      textTemplate,
      input,
      col
   ) {
      filterTracker[col] = input;

      let _bodyRowsFiltered = Object.assign([], bodyRows);

      //user may delete
      filterTracker.forEach((value, idx) => {
         _bodyRowsFiltered = _bodyRowsFiltered.filter(
            row => row[idx].toString().indexOf(value) >= 0
         );
      });

      //reset pagination
      changePagination(_bodyRowsFiltered.length);

      this.setState({
         bodyRowsFiltered: _bodyRowsFiltered
      });
   }

   _renderSearchRow(bodyRows, filterTracker, textTemplate, changePagination) {
      const _num = "number";
      const _text = "text";

      let _searchRow = [];

      for (let i = 0; i < bodyRows[0].length; i++) {
         const _type = i in textTemplate ? _text : _num;
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
                     changePagination,
                     textTemplate
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
      textTemplate,
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
         textTemplate,
         changePagination
      );

      _bodyCols.push(<tr key="bodyRow-search">{_searchRow}</tr>);

      for (let i = _startIdx; i < _endIdx; i++) {
         if (i === _idxLimit) {
            break;
         } //if we reached the limit, we're on the last page
         _bodyCols.push(
            <tr key={`bodyRow-${i}`} title={`row ${i + 1}`}>
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
         return <div>Upload Some Data!</div>;
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
               this.typeTracker.textTemplate,
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
