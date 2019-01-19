import React, { Component } from "react";
import PropTypes from "prop-types";
import "./UploadFile.scss";

class UploadFile extends Component {
   constructor(props) {
      super(props);

      this.state = {
         file: null
      };
   }

   _handleFileAttach(e) {
      const _files = e.target.files;

      //if there is a file
      if (_files.length !== 0) {
         this.props.onChangeAction(_files[0]);
         this.setState({ file: _files[0] });
      }
      //reset to allow for same file
      e.target.value = "";
   }

   render() {
      return (
         <div className="UploadFile">
            <label className="uploadButton" htmlFor="fileInput">
               Select a csv file
               <input
                  id="fileInput"
                  type="file"
                  accept=".csv"
                  onChange={this._handleFileAttach.bind(this)}
               />
            </label>
            <div className="uploadFileName">
               {this.state.file ? this.state.file.name : ""}
            </div>
         </div>
      );
   }
}

UploadFile.propTypes = {
   onChangeAction: PropTypes.func.isRequired
};

export default UploadFile;
