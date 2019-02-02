import React, { Component } from "react";
import PropTypes from "prop-types";

const A_M = {
   a: null,
   b: null,
   c: null,
   d: null,
   e: null,
   f: null,
   g: null,
   h: null,
   i: null,
   j: null,
   k: null,
   l: null,
   m: null
};

class SummaryStats extends Component {
   constructor(props) {
      super(props);

      this.state = {
         statData: {},
         textData: {}
      };
   }

   componentDidMount() {
      const _data = this._calculateData(this.props.bodyData);

      this.setState({
         statData: _data.statData,
         textData: _data.textData
      });
   }

   componentDidUpdate(prevProps) {
      if (this.props.bodyData !== prevProps.bodyData) {
         const _data = this._calculateData(this.props.bodyData);

         this.setState({
            statData: _data.statData,
            textData: _data.textData
         });
      }
   }

   /*
   statData: {
      #: {
         listOfNumbers: [#'s],
         sum: #
      }
   }
   textData: {
      # {
         listOfWords: [words],
         a_m: #,
         n_z: #
      }
   }
   */
   _calculateData(bodyData) {
      if (!bodyData || bodyData.length === 0) {
         return {};
      }

      const _data = this._createTemplate(bodyData[0]);
      let _statData = _data.statTemplate;
      let _textData = _data.textTemplate;

      //go through each row
      bodyData.forEach((row, x) => {
         //go through each column starting from second index
         for (let i = 1; i < row.length; i++) {
            let _val =
               i in _statData ? this._convertNumberString(row[i]) : row[i];
            //if its a number column convert to num and push data (meanwhile also find the sum)
            if (i in _statData && Object.keys(_statData[i]).length !== 0) {
               _statData[i].listOfNumbers.push(_val);
               _statData[i].sum += _val;
            }
            if (i in _statData && Object.keys(_statData[i]).length === 0) {
               _statData[i].listOfNumbers = [_val];
               _statData[i].sum = _val;
            }
            //if it's a string column push data (meanwhile add tally to which half of the alphabet they're in)
            if (i in _textData && Object.keys(_textData[i]).length !== 0) {
               _textData[i].listOfWords.push(_val);
               _val[0].toLowerCase() in A_M
                  ? _textData[i].a_m++
                  : _textData[i].n_z++;
            }
            if (i in _textData && Object.keys(_textData[i]).length === 0) {
               _textData[i].listOfWords = [_val];
               _val[0].toLowerCase() in A_M
                  ? ((_textData[i].a_m = 1), (_textData[i].n_z = 0))
                  : ((_textData[i].n_z = 1), (_textData[i].a_m = 0));
            }
         }
      });

      return { statData: _statData, textData: _textData };
   }

   _createTemplate(row, type) {
      //this will contain the indices of interest
      let _statTemplate = {}; //(numbers)
      let _textTemplate = {}; //(text)

      for (let i = 1; i < row.length; i++) {
         this._isNumber(row[i])
            ? (_statTemplate[i] = {})
            : (_textTemplate[i] = {});
      }
      return { statTemplate: _statTemplate, textTemplate: _textTemplate };
   }

   _isNumber(cellString) {
      const _cellValue = cellString * 1;
      return !isNaN(_cellValue);
   }

   _convertNumberString(cellString) {
      return cellString * 1;
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

   _renderMean(bodyData, statData) {
      const _numRows = bodyData.length;
      const _numCols = bodyData[0].length;
      let _meanCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `mean-${i}`;

         const _mean = i in statData ? statData[i].sum / _numRows : null;
         _meanCols.push(<td key={_key}>{_mean}</td>);
      }

      return (
         <tr>
            <td>Mean</td>
            {_meanCols}
         </tr>
      );
   }

   _renderMedian(bodyData, statData) {
      const _numCols = bodyData[0].length;
      let _medCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `med-${i}`;

         const _med =
            i in statData ? this._findMedian(statData[i].listOfNumbers) : null;
         _medCols.push(<td key={_key}>{_med}</td>);
      }

      return (
         <tr>
            <td>Medium</td>
            {_medCols}
         </tr>
      );
   }

   _renderMode(bodyData, statData) {
      const _numCols = bodyData[0].length;
      let _modeCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `med-${i}`;

         const _modes =
            i in statData
               ? this._findMode(statData[i].listOfNumbers).toString()
               : null;
         _modeCols.push(<td key={_key}>{_modes}</td>);
      }

      return (
         <tr>
            <td>Mode</td>
            {_modeCols}
         </tr>
      );
   }

   _renderRange(bodyData, statData) {
      const _numCols = bodyData[0].length;
      let _rangeCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `range-${i}`;
         const _ranges = null;

         if (i in statData) {
            const _list = statData[i].listOfNumbers;
            _ranges = `${_list[0]}-${_list[_list.length - 1]}`;
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

   _renderSum(bodyData, statData) {
      const _numCols = bodyData[0].length;
      let _sumCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `sum-${i}`;
         const _sums = i in statData ? statData[i].sum : null;
         _sumCols.push(<td key={_key}>{_sums}</td>);
      }

      return (
         <tr>
            <td>Sum</td>
            {_sumCols}
         </tr>
      );
   }

   _renderCountAM(bodyData, textData) {
      const _numCols = bodyData[0].length;
      let _AMCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `am-${i}`;
         const _ams = i in textData ? textData[i].a_m : null;
         _AMCols.push(<td key={_key}>{_ams}</td>);
      }

      return (
         <tr>
            <td>Count: A-M</td>
            {_AMCols}
         </tr>
      );
   }

   _renderCountNZ(bodyData, textData) {
      const _numCols = bodyData[0].length;
      let _NZCols = [];

      for (let i = 1; i < _numCols; i++) {
         const _key = `nz-${i}`;
         const _nzs = i in textData ? textData[i].n_z : null;
         _NZCols.push(<td key={_key}>{_nzs}</td>);
      }

      return (
         <tr>
            <td>Count: N-Z</td>
            {_NZCols}
         </tr>
      );
   }

   render() {
      const _statData = this.state.statData;
      const _textData = this.state.textData;
      const _bodyData = this.props.bodyData;

      if (!_statData || Object.keys(_statData).length === 0) {
         return (
            <tfoot>
               <tr>
                  <td colSpan={_bodyData[0].length}>No Number Columns</td>
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
            {this._renderCountAM(_bodyData, _textData)}
            {this._renderCountNZ(_bodyData, _textData)}
         </tfoot>
      );
   }
}

SummaryStats.propTypes = {
   bodyData: PropTypes.array
};

export default SummaryStats;
