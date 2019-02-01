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

   _isNumber(cellString) {
      const _cellValue = cellString * 1;
      return !isNaN(_cellValue);
   }

   _hasNumberedCells(bodyRow) {
      for (let i = 1; i < bodyRow.length; i++) {
         if (this._isNumber(bodyRow[i])) {
            return true;
         }
      }
      return false;
   }

   _renderTableHead(headerRow) {
      const _headerCols = this._renderRow(headerRow, "headerCell", "th");

      return (
         <thead>
            <tr title={"row 0"}>{_headerCols}</tr>
         </thead>
      );
   }

   _renderTableBody(bodyRows) {
      const _bodyCols = bodyRows.map((bodyRow, idx) => {
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
         return <CustomTag key={`${keyName}-${idx}`}>{cell}</CustomTag>;
      });
   }

   _renderSummaryStats(bodyRows) {
      if (this._hasNumberedCells(bodyRows[0])) {
         return <SummaryStats bodyData={bodyRows} />;
      }
   }

   render() {
      let _tableData = this.state.tableData;

      if (!_tableData || _tableData.length === 0) {
         return <div>Upload Some Data!</div>;
      }

      this.bodyRows = Object.assign([], this.state.tableData);
      this.bodyRows.shift();

      return (
         <table className="AwesomeTable">
            {this._renderTableHead(_tableData[0])}
            {this._renderTableBody(this.bodyRows)}
            {this._renderSummaryStats(this.bodyRows)}
         </table>
      );
   }
}

AwesomeTable.propTypes = {
   tableData: PropTypes.array
};

export default AwesomeTable;
