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

   _createTemplate(row) {
      let _template = {}; //this will contain the indices of interest (numbers)

      for (let i = 1; i < row.length; i++) {
         if (this._isNumber(row[i])) {
            _template[i] = null;
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

      return {};
      const _template = this._createTemplate(bodyData[0]);

      //go through each row
      bodyData.forEach((row, x) => {
         //go through each column starting from second index
         for (let i = 1; i < row.length; i++) {
            if (i in _template) {
               //we gotta put it in the statdata
            }
         }
      });
   }

   _renderMean() {
      //traverse through array
      return (
         <tr>
            <td>Mean</td>
         </tr>
      );
   }

   _renderMedian() {
      return (
         <tr>
            <td>Median</td>
         </tr>
      );
   }

   _renderMode() {
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
            {this._renderMean()}
            {this._renderMedian()}
            {this._renderMode()}
         </tfoot>
      );
   }
}

SummaryStats.propTypes = {
   bodyData: PropTypes.array
};

export default SummaryStats;
