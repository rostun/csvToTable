import React, { Component } from "react";
import PropTypes from "prop-types";

import "../sass/AwesomeTable.scss";
import SummaryStats from "./SummaryStats";

class AwesomeTable extends Component {
   constructor(props) {
      super(props);

      this.bodyRows = [];

      this.state = {
         tableData: []
      };
   }

   componentDidMount() {
      this.setState({ tableData: this._numberRows(this.props.tableData) });
   }

   componentDidUpdate(prevProps) {
      if (this.props.tableData !== prevProps.tableData) {
         this.setState({ tableData: this._numberRows(this.props.tableData) });
      }
   }

   _createTemplate(row, type) {
      //this will contain the indices of interest
      let _numTemplate = {}; //(numbers)
      let _textTemplate = {}; //(text)

      for (let i = 1; i < row.length; i++) {
         this._isNumber(row[i])
            ? (_numTemplate[i] = {})
            : (_textTemplate[i] = {});
      }
      return { numTemplate: _numTemplate, textTemplate: _textTemplate };
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
         row.unshift(idx.toString()); //indices should not be sorted
         return row;
      });

      return tableData;
   }

   _sortColumn(bodyRows) {
      _tableBody = bodyRows.sort()
      this.setState({ tableData: this._numberRows(_tableBody) });
   }

   _renderTableHead(headerRow) {
      const _headerCols = this._renderRow(headerRow, "headerCell", "th");

      return (
         <thead>
            <tr title={"row 0"}>{_headerCols}</tr>
         </thead>
      );
   }

   _renderTableBody(bodyRows, numOfPages, currentPage) {      
      const _startIdx = (currentPage - 1) * numOfPages;
      const _endIdx = _startIdx + numOfPages;
      const _idxLimit = bodyRows.length;

      const _bodyCols = [];

      for (let i = _startIdx; i < _endIdx; i++) {
         if(i === _idxLimit) { break; } //if we reached the limit, we're on the last page
         _bodyCols.push(
            <tr key={`bodyRow-${i}`} title={`row ${i + 1}`}>
               {this._renderRow(bodyRows[i], "bodyCell", "td")}
            </tr>
         );
      }

      return <tbody>{_bodyCols}</tbody>;
   }

   _renderRow(row, keyName, tag) {
      const CustomTag = tag;

      return row.map((cell, idx) => {
         return <CustomTag key={`${keyName}-${idx}`}>{cell}</CustomTag>;
      });
   }

   render() {
      let _tableData = this.state.tableData;

      if (!_tableData || _tableData.length === 0) {
         return <div>Upload Some Data!</div>;
      }

      this.bodyRows = Object.assign([], this.state.tableData);
      this.bodyRows.shift();
      const _template = this._createTemplate(this.bodyRows[0]);

      return (
         <table className="AwesomeTable">
            {this._renderTableHead(_tableData[0])}
            {this._renderTableBody(
               this.bodyRows,
               this.props.numOfPages,
               this.props.currentPage
            )}
            <SummaryStats bodyData={this.bodyRows} template={_template}/>
         </table>
      );
   }
}

AwesomeTable.propTypes = {
   tableData: PropTypes.array,
   numOfPages: PropTypes.number,
   currentPage: PropTypes.number
};

export default AwesomeTable;
