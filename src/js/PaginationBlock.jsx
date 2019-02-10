import React, { Component } from "react";
import PropTypes from "prop-types";

class PaginationBlock extends Component {
   constructor(props) {
      super(props);

      this.state = {
         pageList: [],
         currentPage: 1
      };
   }

   componentDidMount() {
      this.setState({ pageList: this._buildPageList(this.props.numOfPages) });
   }

   componentDidUpdate(prevProps) {
      if (this.props.numOfPages !== prevProps.numOfPages) {
         this.setState({
            pageList: this._buildPageList(this.props.numOfPages)
         });
      }
   }

   _buildPageList(numOfPages) {
      let _pageNumbers = [];

      for (let i = 0; i < numOfPages; i++) {
         _pageNumbers.push(
            <li
               key={`page-${i + 1}`}
               id={i + 1}
               onClick={this._handleClick.bind(this)}
            >
               {i + 1}
            </li>
         );
      }
      return _pageNumbers;
   }

   _handleClick(event) {
      let _currentPage = Number(event.target.id);

      this.props.changePage(_currentPage);
      this.setState({
         currentPage: _currentPage
      });
   }

   render() {
      const _pageList = this.state.pageList;

      if (!_pageList || _pageList <= 0) {
         return <div>One Page</div>;
      }

      return <ul className="PaginationBlock">{this.state.pageList}</ul>;
   }
}

PaginationBlock.propTypes = {
   numOfPages: PropTypes.number.isRequired,
   changePage: PropTypes.func.isRequired
};

export default PaginationBlock;
