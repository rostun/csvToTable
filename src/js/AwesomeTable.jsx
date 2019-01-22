import React, { Component } from "react";
import PropTypes from "prop-types";

import "../sass/AwesomeTable.scss";
import SummaryStats from "./SummaryStats";

class AwesomeTable extends Component {
   constructor(props) {
      super(props);

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

   _numberRows(_tableData) {
      if (_tableData && _tableData.length > 0) {
         _tableData = _tableData.map((row, idx) => {
            row.unshift(idx.toString()); //indices should not be sorted
            return row;
         });
      }

      return _tableData;
   }

   _convertCell(cellString) {
      return cellString * 1;
   }

   _createTemplate() {
      const _tableData = this.state.tableData;
      let _template = []; //this will contain the indices of numerical columns
      if (_tableData) {
         _tableData[0].forEach((cell, idx) => {
            if (!isNaN(cell)) {
               _template.push(idx);
            }
         });
      }
      return _template;
   }

   _isNumber(cellString) {
      const cell_value = cellString * 1;
      return !isNaN(cell_value);
   }

   _renderTableHead() {
      //first row is header row
      const _headerRow = this.state.tableData[0];
      const _headerCols = this._renderRow(_headerRow, "headerCell", "th");

      return (
         <thead>
            <tr title={"row 0"}>{_headerCols}</tr>
         </thead>
      );
   }

   _renderTableBody() {
      //remove first row (header row)
      let _bodyRows = Object.assign([], this.state.tableData);

      _bodyRows.shift(); //_bodyRows.splice(0, 1);

      const _bodyCols = _bodyRows.map((bodyRow, idx) => {
         return (
            <tr key={`bodyRow=${idx}`} title={`row ${idx + 1}`}>
               {this._renderRow(bodyRow, "bodyCell", "td")}
            </tr>
         );
      });

      return <tbody>{_bodyCols}</tbody>;
   }

   _renderRow(row, keyName, tag) {
      const CustomTag = tag;

      return row.map((cell, idx) => {
         const _cell =
            this._isNumber(cell) && idx !== 0 ? this._convertCell(cell) : cell;
         return <CustomTag key={`${keyName}-${idx}`}>{_cell}</CustomTag>;
      });
   }

   _renderSummaryStats() {
      //determine if we need to show footer
      const _template = this._createTemplate();
      if (_template.length > 0) {
         return <SummaryStats bodyData={_tableData} template={_template} />;
      }
   }

   render() {
      let _tableData = Object.assign([], this.state.tableData); //arrays are passed by reference

      if (_tableData && _tableData.length > 0) {
         _tableData.shift();
         return (
            <table className="AwesomeTable">
               {this._renderTableHead()}
               {this._renderTableBody()}
               {this._renderSummaryStats()}
            </table>
         );
      } else {
         return <div>Upload Some Data!</div>;
      }
   }
}

AwesomeTable.propTypes = {
   tableData: PropTypes.array
};

export default AwesomeTable;
