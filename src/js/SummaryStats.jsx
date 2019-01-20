import React, { Component } from "react";
import PropTypes from "prop-types";

import "../sass/SummaryStats.scss";

class SummaryStats extends Component {
   constructor(props) {
      super(props);

      this.state = {
         bodyData: []
      };
   }

   componentDidMount() {
      this.setState({ bodyData: this.props.bodyData });
   }

   componentDidUpdate(prevProps) {
      if (this.props.bodyData !== prevProps.bodyData) {
         this.setState({ bodyData: this.props.bodyData });
      }
   }

   _renderMean() {
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
