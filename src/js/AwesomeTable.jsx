import React, { Component } from "react";
import PropTypes from "prop-types";

import "../sass/AwesomeTable.scss";

class AwesomeTable extends Component {
   constructor(props) {
      super(props);

      this.state = {
         rowData: []
      };
   }

   componentDidMount() {
      this.setState({ rowData: this.props.data });
   }

   componentDidUpdate(prevProps) {
      if (this.props.data !== prevProps.data) {
         this.setState({ rowData: this.props.data });
      }
   }

   _renderTableHead() {
      //first row is header row
      const _headerRow = this.state.rowData[0];
      const _headerCols = this._renderRow(_headerRow, "headerCell", "th", 0);

      return (
         <thead>
            <tr title={"row 0"}>{_headerCols}</tr>
         </thead>
      );
   }

   _renderTableBody() {
      //remove first row (header row)
      let _bodyRows = this.state.rowData;
      
      _bodyRows.shift(); //_bodyRows.splice(0, 1);

      const _bodyCols = _bodyRows.map((bodyRow, idx) => {
         return (
            <tr key={`bodyRow=${idx}`} title={`row ${idx + 1}`}>
               {this._renderRow(bodyRow, "bodyCell", "td", idx + 1)}
            </tr>
         );
      });

      return <tbody>{_bodyCols}</tbody>;
   }

   _renderRow(row, keyName, tag, index) {
      const CustomTag = tag;

      let _cells = row.map((cell, idx) => {
         return <CustomTag key={`${keyName}-${idx}`}>{cell}</CustomTag>;
      });

      //add index to beginning of row
      _cells.unshift(<CustomTag key={`rowNumber-${index}`}>{index}</CustomTag>);
      return _cells;
   }

   render() {
      if (this.state.rowData.length > 0) {
         return (
            <table className="AwesomeTable">
               {this._renderTableHead()}
               {this._renderTableBody()}
            </table>
         );
      } else {
         return <div>Upload Some Data!</div>;
      }
   }
}

AwesomeTable.propTypes = {
   data: PropTypes.array
};

export default AwesomeTable;
