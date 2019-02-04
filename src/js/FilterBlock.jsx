import React, { Component } from "react";
import PropTypes from "prop-types";

class FilterBlock extends Component {
   constructor(props) {
      super(props);

		this.timer_is_on = true;
		this.delayTimer = null;

      this.state = {
         input: ""
      };
   }

   _onType(e) {
		if(this.timer_is_on) {
			clearTimeout(this.delayTimer);
			this.timer_is_on = false;
		}
      this.setState({
         input: e.target.value
		});		

		if(!this.timer_is_on) {
			this.delayTimer = setTimeout(() => {
				this.timer_is_on = false;
				this.props.onChangeAction(this.state.input, this.props.id);
			}, 250);

			this.timer_is_on = true;
		}
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
	id: PropTypes.number,
   _key: PropTypes.string,
	type: PropTypes.oneOf(["number", "text"]).isRequired,
	onChangeAction: PropTypes.func
};

export default FilterBlock;
