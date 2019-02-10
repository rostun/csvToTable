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
      if (this.timer_is_on) {
         clearTimeout(this.delayTimer);
         this.timer_is_on = false;
      }
      this.setState({
         input: e.target.value
      });

      if (!this.timer_is_on) {
         this.delayTimer = setTimeout(() => {
            this.timer_is_on = false;
            this.props.onChangeAction(this.state.input, this.props.id);
         }, 300);

         this.timer_is_on = true;
      }
   }

   _updateFilterValue(e) {
      console.log(e.target.value);
   }

   render() {
      let _alternateFilter =
         this.props.type === "number" ? "Filter by Range" : "Filter by Letters";

      return (
         <div className="FilterBlock">
            <div className="filterFlag">
               <input
                  type="checkbox"
                  id="specialFilterFlag"
                  onChange={this._updateFilterValue.bind(this)}
               />
               <label htmlFor="specialFilterFlag">{_alternateFilter}</label>
            </div>
            <div className="normalFilter">
               <input
                  value={this.state.input}
                  type="text"
                  onChange={this._onType.bind(this)}
               />
            </div>
         </div>
      );
   }
}

FilterBlock.propTypes = {
   id: PropTypes.number,
   type: PropTypes.oneOf(["number", "text"]).isRequired,
   onChangeAction: PropTypes.func
};

export default FilterBlock;
