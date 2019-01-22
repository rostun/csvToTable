import React, { Component } from "react";
import PropTypes from "prop-types";

class SummaryStats extends Component {
   constructor(props) {
      super(props);

      this.state = {
         grid: [],
         template: []
      };
   }

   componentDidMount() {
      this.setState({ grid: this.props.bodyData });
   }

   componentDidUpdate(prevProps) {
      if (this.props.bodyData !== prevProps.bodyData) {
         this.setState({ grid: this.props.bodyData });
      }
   }

   _calculateTemplate(_bodyData) {}

   _calculateGrid(_bodyData) {
      const _template = this._calculateRowTemplate(); //[1, 3, 5]
      const _dataByColumns = [];

      //go through each row
      this.props.bodyData.forEach((row, x) => {
         //go through each column
         row.forEach((cell, y) => {
            //if index is one we care about
            //array[i].push(row[i])
         });
      });
   }

   _renderMean() {
      //traverse through array
      return (
         <tr>
            <td>hello</td>
         </tr>
      );
   }

   _renderMedian() {
      return (
         <tr>
            <td>hello</td>
         </tr>
      );
   }

   _renderMode() {
      return (
         <tr>
            <td>hello</td>
         </tr>
      );
   }

   render() {
      const _grid = this.state.grid;

      if (_grid && _grid.length > 0) {
         return (
            <tfoot>
               {this._renderMean()}
               {this._renderMedian()}
               {this._renderMode()}
            </tfoot>
         );
      } else {
         return (
            <tfoot>
               <tr>No Number Columns</tr>
            </tfoot>
         );
      }
   }
}

SummaryStats.propTypes = {
   bodyData: PropTypes.array,
   template: PropTypes.array
};

export default SummaryStats;
