import React, { Component } from "react";
import PropTypes from "prop-types";

class FilterBlock extends Component {
   constructor(props) {
      super(props);

      this.timer_is_on = true;
      this.delayTimer = null;

      this.state = {
         input: "",
         specialInput: ""
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
               this.state.specialInput,
               this.props.type,
               this.props.id
            );
         }, 250);

         this.timer_is_on = true;
      }
   }

   _onSpecialType(e) {
      if (this.timer_is_on) {
         clearTimeout(this.delayTimer);
         this.timer_is_on = false;
      }
      this.setState({
         specialInput: e.target.value
      });

      if (!this.timer_is_on) {
         this.delayTimer = setTimeout(() => {
            this.timer_is_on = false;
            this.props.onChangeAction(
               this.state.input,
               this.state.specialInput,
               this.props.type,
               this.props.id
            );
         }, 500);

         this.timer_is_on = true;
      }
   }

   render() {
      let _alternateFilter =
         this.props.type === "number" ? "Filter by Range" : "Filter by Anagram";

      return (
         <div className="FilterBlock">
            <div className="normalFilter">
               <label htmlFor={`normalFilter-${this.props.id}`}>
                  {"Normal Filter"}
               </label>
               <input
                  id={`normalFilter-${this.props.id}`}
                  value={this.state.input}
                  type="text"
                  placeholder={"search..."}
                  onChange={this._onType.bind(this)}
               />
            </div>
            <div className="specialFilter">
               <label htmlFor={`specialFilter-${this.props.id}`}>
                  {_alternateFilter}
               </label>
               <input
                  id={`specialFilter-${this.props.id}`}
                  value={this.state.specialInput}
                  type="text"
                  placeholder={
                     this.props.type === "number"
                        ? "0..100, >1000, <1000"
                        : "teh => the"
                  }
                  onChange={this._onSpecialType.bind(this)}
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
