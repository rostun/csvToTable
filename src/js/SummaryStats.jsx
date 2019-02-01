import React, { Component } from "react";
import PropTypes from "prop-types";

class SummaryStats extends Component {
   constructor(props) {
      super(props);

      this.state = {
         statData: {}
      };
   }

   componentDidMount() {
      this.setState({ statData: this._calculateStatData(this.props.bodyData) });
   }

   componentDidUpdate(prevProps) {
      if (this.props.bodyData !== prevProps.bodyData) {
         this.setState({
            statData: this._calculateStatData(this.props.bodyData)
         });
      }
   }

   _isNumber(cellString) {
      const _cellValue = cellString * 1;
      return !isNaN(_cellValue);
   }

   _convertNumberString(cellString) {
      return cellString * 1;
   }

   _createTemplate(row) {
      let _template = {}; //this will contain the indices of interest (numbers)

      for (let i = 1; i < row.length; i++) {
         if (this._isNumber(row[i])) {
            _template[i] = {};
         }
      }
      return _template;
   }

   /*
   statData: {
      #: {
         listOfNumbers: [#'s],
         sum: #,
         mean: #,
         median: #,
         mode: #
      }
   }
   */
   _calculateStatData(bodyData) {
      if (!bodyData || bodyData.length === 0) {
         return {};
      }

      let _template = this._createTemplate(bodyData[0]);

      //go through each row
      bodyData.forEach((row, x) => {
         //go through each column starting from second index
         for (let i = 1; i < row.length; i++) {
            //if its a number column convert it and push it into the template (meanwhile also find the sum)
            let _num = i in _template ? this._convertNumberString(row[i]) : 0;
            if (i in _template && Object.keys(_template[i]).length !== 0) {
               _template[i].listOfNumbers.push(_num);
               _template[i].sum += _num;
            }
            if (i in _template && Object.keys(_template[i]).length === 0) {
               _template[i].listOfNumbers = [_num];
               _template[i].sum = _num;
            }
         }
      });

      return _template;
   }

   _renderMean(bodyData, template) {
      const _numRows = bodyData.length;
      const _numCols = bodyData[0].length;

      let _meanCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `mean-${i}`;

         const _mean = i in template ? template[i].sum / _numRows : null;
         _meanCols.push(<td key={_key}>{_mean}</td>);
      }

      return (
         <tr>
            <td>{"Mean"}</td>
            {_meanCols}
         </tr>
      );
   }

   _findMedian(values) {
      values.sort((a, b) => a - b); //The compare function should return -1, 0 or +1

      const _half = Math.floor(values.length / 2);

      return values.length % 2 ? values[_half] : (values[_half - 1] + values[_half]) / 2.0;
   }

   _renderMedian(bodyData, template) {
      const _numRows = bodyData.length;
      const _numCols = bodyData[0].length;

      let _medCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `med-${i}`;

         const _med = i in template ? this._findMedian(template[i].listOfNumbers) : null;
         _medCols.push(<td key={_key}>{_med}</td>);
      }

      return (
         <tr>
            <td>{"Mean"}</td>
            {_medCols}
         </tr>
      );
   }

   findMode(values) {

   }

   _renderMode(bodyData, template) {
      return (
         <tr>
            <td>Mode</td>
         </tr>
      );
   }

   render() {
      const _statData = this.state.statData;

      if (!_statData || Object.keys(_statData).length === 0) {
         return (
            <tfoot>
               <tr>No Number Columns</tr>
            </tfoot>
         );
      }
      return (
         <tfoot>
            {this._renderMean(this.props.bodyData, _statData)}
            {this._renderMedian(this.props.bodyData, _statData)}
            {this._renderMode(this.props.bodyData, _statData)}
         </tfoot>
      );
   }
}

SummaryStats.propTypes = {
   bodyData: PropTypes.array
};

export default SummaryStats;
