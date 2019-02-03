import React, { Component } from "react";
import PropTypes from "prop-types";

import "../sass/AwesomeTable.scss";
import SummaryStats from "./SummaryStats";
import FilterBlock from "./FilterBlock";

class AwesomeTable extends Component {
   constructor(props) {
      super(props);

      this.headerRow = [];
      this.bodyRows = [];

      this.state = {
         tableData: [],
         currentColumn: 0
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

   _sortColumn(headerRow, bodyRows, template, e) {
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
         bodyRows.sort(this._numSort(_id));
      }
      if ((_id in _texts && _current === null) || _current !== _id) {
         bodyRows.sort(this._textSort(_id));
      }
      //same column clicked
      if (_id === _current) {
         bodyRows.reverse();
         _id = null;
      }

      let _tableData = Object.assign([], bodyRows);
      _tableData.unshift(headerRow);

      this.setState({
         tableData: _tableData,
         currentColumn: _id
      });
   }

   _renderTableHead(headerRow, bodyRows, template) {
      const _headerCols = this._renderCell(
         headerRow,
         "headerCell",
         "th",
         this._sortColumn.bind(this, headerRow, bodyRows, template)
      );

      return (
         <thead>
            <tr title={"row 0"}>{_headerCols}</tr>
         </thead>
      );
   }

   _renderTableBody(bodyRows, textTemplate, numOfPages, currentPage) {
      const _startIdx = (currentPage - 1) * numOfPages;
      const _endIdx = _startIdx + numOfPages;
      const _idxLimit = bodyRows.length;

      let _bodyCols = [];

      const _searchRow = this._renderSearchRow(bodyRows, textTemplate);

      _bodyCols.push(<tr key="bodyRow-search">{_searchRow}</tr>);

      for (let i = _startIdx; i < _endIdx; i++) {
         if (i === _idxLimit) {
            break;
         } //if we reached the limit, we're on the last page
         _bodyCols.push(
            <tr key={`bodyRow-${i}`} title={`row ${i + 1}`}>
               {this._renderCell(bodyRows[i], "bodyCell", "td")}
            </tr>
         );
      }

      return <tbody>{_bodyCols}</tbody>;
   }

   _renderSearchRow(bodyRows, textTemplate) {
      const _num = "number";
      const _text = "text";

      let _searchRow = [];

      for (let i = 0; i < bodyRows[0].length; i++) {
         const _type = i in textTemplate ? _text : _num;
         _searchRow.push(
            <td key={`search-cell${i}`}>
               <FilterBlock _key={`searchBlock-${i}`} type={_type} />
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

   render() {
      let _tableData = this.state.tableData;

      if (!_tableData || _tableData.length === 0) {
         return <div>Upload Some Data!</div>;
      }

      this.headerRow = _tableData[0];
      this.bodyRows = Object.assign([], this.state.tableData);
      this.bodyRows.shift();

      return (
         <table className="AwesomeTable">
            {this._renderTableHead(
               this.headerRow,
               this.bodyRows,
               this.props.template
            )}
            {this._renderTableBody(
               this.bodyRows,
               this.props.template.textTemplate,
               this.props.numOfPages,
               this.props.currentPage
            )}
            <SummaryStats
               bodyData={this.bodyRows}
               template={this.props.template}
            />
         </table>
      );
   }
}

AwesomeTable.propTypes = {
   tableData: PropTypes.array.isRequired,
   template: PropTypes.object.isRequired,
   numOfPages: PropTypes.number.isRequired,
   currentPage: PropTypes.number.isRequired
};

export default AwesomeTable;
