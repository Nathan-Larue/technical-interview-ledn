import "./TokensPage.css";
import React from "react";
import { Add, Reduce, Download } from "@icon-park/react";
import { saveAs } from "file-saver";
import { TokensList } from "../tokens-list/TokensList.js";

export class TokensPage extends React.Component {
  constructor(props) {
    super(props);
    this.toggleDatasetSize = this.toggleDatasetSize.bind(this);

    // Creating a reference tp access a component state later on
    this.TokensListRef = React.createRef();

    // Set the state
    this.state = {
      searchValue: "",
      isDatasetLarge: false,
    };

    // Bind this to the function to keep it defined
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  /**
   * Notifies the change in input from the name search to the state
   * @param {Object} event - The event information passed by the input release
   */
  async onSearchChange(event) {
    await this.setState({ searchValue: event.target.value });
  }

  /**
   * Toggles the type of dataset, from small to large and vice-versa
   */
  async toggleDatasetSize() {
    await this.setState({ isDatasetLarge: !this.state.isDatasetLarge });
  }

  /**
   * Triggers the download of the CSV file of the displayed data
   */
  onDownloadCsv() {
    const tokensListState = this.TokensListRef.current.state;

    // Setup the CSV header
    let csvContent =
      "First Name, Last Name, Country, Email, Date of Birth, MFA Type, Amount, Date Created, Referred By\n";

    // Build the csv data with the displayed data from the TokensList state
    tokensListState.filteredAndOrderedTokensList.forEach((tokenHolder) => {
      Object.keys(tokenHolder).forEach((tokenParameter) => {
        if (tokenParameter === "guid") return;
        csvContent += `${tokenHolder[tokenParameter]}, `;
      });
      csvContent += `\n`;
    });

    // Setup the file parameters and allow the user to download it
    const date = new Date();
    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `Ledn_Tokens_List_${date.toISOString()}.csv`);
  }

  render() {
    return (
      <div className="token-page">
        {/* 
          This section represents the header, which means the search input and the 
          CSV download and the two buttons above the table 
        */}
        <div className="token-header-container">
          <input
            type="text"
            className="token-header-search"
            placeholder="search by name"
            value={this.state.searchValue}
            onChange={this.onSearchChange}
          />
          <button
            className="token-header-button"
            onClick={this.toggleDatasetSize}
          >
            <div className="token-header-button-icon-wrapper">
              {this.state.isDatasetLarge ? <Reduce /> : <Add />}
            </div>
            <div className="token-header-button-text-wrapper">TOKENS</div>
          </button>
          <button
            className="token-header-button"
            onClick={() => this.onDownloadCsv()}
          >
            <div className="token-header-button-icon-wrapper">
              <Download />
            </div>
            <div className="token-header-button-text-wrapper">CSV</div>
          </button>
        </div>

        {/* This section contains the wrapper for the main table */}
        <div className="token-list-wrapper">
          <TokensList
            ref={this.TokensListRef}
            isDatasetLarge={this.state.isDatasetLarge}
            searchValue={this.state.searchValue}
          />
        </div>
      </div>
    );
  }
}
