import React, { Component } from "react";
import PropTypes from "prop-types";

class AwesomeTable extends Component {
   constructor(props) {
      super(props);

      this.state = {
      };
   }

   render() {
      return (
         <div className="AwesomeTable">
         </div>
      );
   }
}

AwesomeTable.propTypes = {
   data: PropTypes.array
};

export default AwesomeTable;
