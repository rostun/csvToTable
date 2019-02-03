import React, { Component } from "react";
import PropTypes from "prop-types";

class FilterBlock extends Component {
   constructor(props) {
      super(props);

      this.state = {
         input: ""
      };
   }

   _onType(e) {
      this.setState({
         input: e.target.value
      });
   }

   render() {
      return (
         <input
            key={`searchInput-${this.props._key}`}
            value={this.state.input}
            type={this.props.type}
            onChange={this._onType.bind(this)}
         />
      );
   }
}

FilterBlock.propTypes = {
   _key: PropTypes.string,
   type: PropTypes.oneOf(["number", "text"]).isRequired
};

export default FilterBlock;
