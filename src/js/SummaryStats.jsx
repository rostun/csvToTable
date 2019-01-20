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

   render() {
      return <tfoot>
			<tr>
				<td>hello</td>
			</tr>
		</tfoot>;
   }
}

SummaryStats.propTypes = {
   bodyData: PropTypes.array
};

export default SummaryStats;
