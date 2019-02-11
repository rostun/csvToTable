import React, { Component } from "react";
import PropTypes from "prop-types";

class FilterBlock extends Component {
   constructor(props) {
      super(props);

      this.timer_is_on = true;
      this.delayTimer = null;

      this.state = {
         input: "",
         checked: false
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
            this.props.onChangeAction(
               this.state.input,
               this.state.checked,
               this.props.type,
               this.props.id
            );
         }, 500);

         this.timer_is_on = true;
      }
   }

   _updateFilterValue(e) {
      this.setState({
         checked: e.target.checked
      });
   }

   render() {
      let _alternateFilter =
         this.props.type === "number" ? "Filter by Range" : "Filter by Anagrams";

      let _placeHolder = "Search...";

      if (this.state.checked === true) {
         _placeHolder =
            this.props.type === "number"
               ? "0..100, >1000, <1000"
               : "teh => the";
      }

      return (
         <div className="FilterBlock">
            <div className="filterFlag">
               <input
                  type="checkbox"
                  id={`specialFilterFlag-${this.props.id}`}
                  onChange={this._updateFilterValue.bind(this)}
               />
               <label htmlFor={`specialFilterFlag-${this.props.id}`}>
                  {_alternateFilter}
               </label>
            </div>
            <div className="normalFilter">
               <input
                  value={this.state.input}
                  type="text"
                  placeholder={_placeHolder}
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
