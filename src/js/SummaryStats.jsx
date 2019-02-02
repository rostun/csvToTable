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

   _findMedian(values) {
      values.sort((a, b) => a - b); //The compare function should return -1, 0 or +1

      const _half = Math.floor(values.length / 2);

      return values.length % 2
         ? values[_half]
         : (values[_half - 1] + values[_half]) / 2.0;
   }

   _findMode(values) {
      let _modeLookup = {};
      let _modes = [{ value: 0, count: 0 }];

      values.forEach(num => {
         num in _modeLookup ? _modeLookup[num]++ : (_modeLookup[num] = 1);
      });

      Object.keys(_modeLookup).forEach(prop => {
         if (_modeLookup[prop] === _modes[0].count) {
            _modes.push({ value: prop, count: _modeLookup[prop] });
         }
         if (_modeLookup[prop] > _modes[0].count) {
            _modes = [{ value: prop, count: _modeLookup[prop] }];
         }
      });

      return _modes.map(mode => {
         return mode.value;
      });
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
            <td>Mean</td>
            {_meanCols}
         </tr>
      );
   }

   _renderMedian(bodyData, template) {
      const _numCols = bodyData[0].length;
      let _medCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `med-${i}`;

         const _med = i in template ? this._findMedian(template[i].listOfNumbers) : null;
         _medCols.push(<td key={_key}>{_med}</td>);
      }

      return (
         <tr>
            <td>Medium</td>
            {_medCols}
         </tr>
      );
   }

   _renderMode(bodyData, template) {
      const _numCols = bodyData[0].length;
      let _modeCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `med-${i}`;

         const _modes = i in template ? this._findMode(template[i].listOfNumbers).toString() : null;
         _modeCols.push(<td key={_key}>{_modes}</td>);
      }

      return (
         <tr>
            <td>Mode</td>
            {_modeCols}
         </tr>
      );
   }

   _renderRange(bodyData, template) {
      const _numCols = bodyData[0].length;
      let _rangeCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `range-${i}`;
         const _ranges = null;

         if (i in template) {
            const _list = template[i].listOfNumbers;
            _ranges = `${_list[0]}-${_list[_list.length-1]}`;
         }

         _rangeCols.push(<td key={_key}>{_ranges}</td>);
      }

      return (
         <tr>
            <td>Range</td>
            {_rangeCols}
         </tr>
      );
   }

   _renderSum(bodyData, template) {
      const _numCols = bodyData[0].length;
      let _sumCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `sum-${i}`;
         const _sums = i in template ? template[i].sum : null;
         _sumCols.push(<td key={_key}>{_sums}</td>);
      }

      return (
         <tr>
            <td>Sum</td>
            {_sumCols}
         </tr>
      );
   }

   render() {
      const _statData = this.state.statData;
      const _bodyData = this.props.bodyData;

      if (!_statData || Object.keys(_statData).length === 0) {
         return (
            <tfoot>
               <tr>
                  <td colSpan={_bodyData[0].length}>
                     No Number Columns
                  </td>
               </tr>
            </tfoot>
         );
      }
      return (
         <tfoot>
            {this._renderMean(_bodyData, _statData)}
            {this._renderMedian(_bodyData, _statData)}
            {this._renderMode(_bodyData, _statData)}
            {this._renderRange(_bodyData, _statData)}
            {this._renderSum(_bodyData, _statData)}
         </tfoot>
      );
   }
}

SummaryStats.propTypes = {
   bodyData: PropTypes.array
};

export default SummaryStats;
