import "./TokensList.css";
import React from "react";
import { SortAmountDown, SortAmountUp, Filter } from "@icon-park/react";
import { uuid } from "uuidv4";
import PropTypes from "prop-types";
import { FilterPopover } from "../filter-popover/FilterPopover.js";
import loadingGif from "../../assets/loading.gif";
import tokensList from "../../assets/accounts.json";
import largeTokensList from "../../assets/accounts_large.json";
import {
  TOKENS_ORDER_TYPE,
  TOKENS_FILTER_TYPE,
  BASE_STATE,
} from "./TokensList.definitions.js";

// Url used to get icons when passing the custom component was not possible
const FLAG_URL_TEMPLATE = `http://purecatamphetamine.github.io/country-flag-icons/3x2/{{COUNTRY_CODE}}.svg`;

export class TokensList extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);

    // Initially set the dataset as the provided accounts
    const dataset = tokensList;

    // Added a guid for each individual tokens and made it immutable
    this.keyedTokensList = this.addKeyToFilterList(dataset);
    this.countryFilterList = this.getCountryFiltersList(dataset);
    this.mfaFilterList = this.getMfaFiltersList(dataset);

    // Initiate the state when the page is opened
    this.state = {
      ...BASE_STATE,
      filteredTokensList: this.keyedTokensList,
      filteredAndOrderedTokensList: this.keyedTokensList,
      renderedList: this.buildTokenLines(
        this.keyedTokensList.slice(0, BASE_STATE.scrollMaxItems)
      ),
    };
  }

  /**
   * We use the props update function to update the search value or to change our dataset when toggled
   * @param {Object} prevProps - List of props that we had prior to the update
   */
  async componentDidUpdate(prevProps) {
    // If the search value has changed
    if (this.props.searchValue !== prevProps.searchValue) {
      // Update searchValue
      await this.setState({ searchValue: this.props.searchValue });

      // Refilter the list, order it and then render it
      await this.filterTokensList();
      await this.orderTokensList();
      this.updateRenderedList(this.state.filteredAndOrderedTokensList);
    }

    // If our dataset has change, reset the state and rerender the page
    if (this.props.isDatasetLarge !== prevProps.isDatasetLarge) {
      const dataset = this.props.isDatasetLarge ? largeTokensList : tokensList;

      // Initiate the state
      await this.setState({
        ...BASE_STATE,
        searchValue: this.state.searchValue,
      });

      // Added a guid for each individual tokens and made it immutable
      this.keyedTokensList = this.addKeyToFilterList(dataset);
      this.countryFilterList = this.getCountryFiltersList(dataset);
      this.mfaFilterList = this.getMfaFiltersList(dataset);

      await this.filterTokensList();
      await this.orderTokensList();
      await this.updateRenderedList(this.state.filteredAndOrderedTokensList);
    }

    // If our dataset has change, reset the state and rerender the page
    if (this.props.isLoading !== prevProps.isLoading) {
      await this.setState({ isLoading: this.props.isLoading });
    }
  }

  /**
   * Receives a list of object and add/redefine a unique id to the guid parameter of all items
   * @param {List} tokensList - The initial list to be received
   * @returns {List} The same list but with every item given a new guid under the guid property
   */
  addKeyToFilterList(tokensList) {
    // Added a guid for each individual tokens and made it immutable
    return tokensList.map((tokenItem) => ({
      ...tokenItem,
      guid: uuid(),
    }));
  }

  /**
   * Generates a list of object to pass to the filter (country) popover
   * @param {Array} tokensList - The list of tokens to be passed
   * @returns {Array} A list of object containing the text to display and the reference to the token parameter
   */
  getCountryFiltersList(tokensList) {
    return [
      ...new Set(
        tokensList.map((tokenItem) => tokenItem.Country.toUpperCase())
      ),
    ].map((countryCode) => {
      // Generates a URL since we can't pass a custom component via a string
      const flagUrl = FLAG_URL_TEMPLATE.replace(
        "{{COUNTRY_CODE}}",
        countryCode
      );

      //Return an object with a ref parameter as the unique reference to the filter, and the displayed text
      return {
        ref: countryCode,
        text: (
          <div>
            <img
              alt={countryCode}
              className="token-list-flag-icon"
              src={flagUrl}
            />{" "}
            {` ${countryCode}`}
          </div>
        ),
      };
    });
  }

  /**
   * Generates a list of object to pass to the filter (mfa) popover
   * @param {Array} tokensList - The list of tokens to be passed
   * @returns {Array} A list of object containing the text to display and the reference to the token parameter
   */
  getMfaFiltersList(tokensList) {
    return [...new Set(tokensList.map((tokenItem) => tokenItem.mfa))].map(
      (mfaItem) => ({
        ref: mfaItem,
        text: mfaItem === "null" ? "None" : mfaItem,
      })
    );
  }

  /**
   * This is triggered whenever the user is scrolling, in order to identify when to add items to our infinite list
   * @param {Object} event - HTML event passed when the scroll happens
   */
  async onListScroll(event) {
    // If the scroll is less then 300px from the bottom and we haven't reach the maximum of tokens to display
    if (
      event.target.scrollTop + event.target.offsetHeight >
        event.target.scrollHeight - 300 &&
      this.state.scrollMaxItems < this.state.filteredAndOrderedTokensList.length
    ) {
      // Update the maximum of displayed token and update the list that is rendered
      await this.setState({ scrollMaxItems: this.state.scrollMaxItems + 50 });
      await this.updateRenderedList(this.state.filteredAndOrderedTokensList);
    }
  }

  /**
   * Whenever an option in the filters is changed (country or mfa selected), we need to rerender the list
   */
  async onFilterChange(filtersList) {
    const filters = {
      ...this.state.filters,
      [this.state.filteringType]: filtersList
        .filter((filterItem) => !filterItem.active)
        .map((filterItem) => filterItem.ref),
    };

    await this.setState({ filters });
    await this.filterTokensList();
    await this.orderTokensList();
    this.updateRenderedList(this.state.filteredAndOrderedTokensList);
  }

  /**
   * This functions triggers the filter on the previously keyed state array and updates the state filtered array
   */
  async filterTokensList() {
    const filteredList = this.keyedTokensList.filter(
      (TokenItem) =>
        this.isTokenNameValid(TokenItem) &&
        this.isTokenCountryValid(TokenItem) &&
        this.isTokenMfaValid(TokenItem)
    );

    await this.setState({ filteredTokensList: filteredList });
  }

  /**
   * This functions returns if a given token account holder has a name valid once compared with the search
   * @param {Object} tokenItem - Information on the token holder
   * @returns {Boolean} Returns if the token account contains the search name
   */
  isTokenNameValid(tokenItem) {
    const firstname = tokenItem["First Name"].toLowerCase();
    const lastname = tokenItem["Last Name"].toLowerCase();
    const fullname =
      `${tokenItem["First Name"]} ${tokenItem["Last Name"]}`.toLowerCase();
    const searchValue = this.state.searchValue.toLowerCase();

    return (
      firstname.startsWith(searchValue) ||
      lastname.startsWith(searchValue) ||
      fullname.startsWith(searchValue)
    );
  }

  /**
   * This functions returns if a given token account holder has an unfiltered country
   * @param {Object} tokenItem - Information on the token holder
   * @returns {Boolean} Returns if the token account country is in the list of selected countries
   */
  isTokenCountryValid(tokenItem) {
    return !this.state.filters[TOKENS_FILTER_TYPE.COUNTRY].includes(
      tokenItem.Country
    );
  }

  /**
   * This functions returns if a given token account holder has an unfiltered mfa type
   * @param {Object} tokenItem - Information on the token holder
   * @returns {Boolean} Returns if the token account mfa type is in the list of selected mfa
   */
  isTokenMfaValid(tokenItem) {
    return !this.state.filters[TOKENS_FILTER_TYPE.MFA].includes(tokenItem.mfa);
  }

  /**
   * Set the ordering we want to prioritize and set
   * @param {String} orderingType - Describes which column is currently being ordered
   */
  async setOrderType(orderingType) {
    // Update the state
    await this.setState({
      orderingType: orderingType,
      orderingDirection:
        orderingType === this.state.orderingType
          ? -this.state.orderingDirection
          : 1,
    });

    // Order and render
    await this.orderTokensList();
    this.updateRenderedList(this.state.filteredAndOrderedTokensList);
  }

  /**
   * This functions triggers the order on the previously filtered state array and updates the state ordered array
   */
  async orderTokensList() {
    const orderedList = this.state.filteredTokensList.sort((tokenA, tokenB) => {
      if (tokenA[this.state.orderingType] < tokenB[this.state.orderingType]) {
        return -this.state.orderingDirection;
      }
      if (tokenA[this.state.orderingType] > tokenB[this.state.orderingType]) {
        return this.state.orderingDirection;
      }
      return 0;
    });

    await this.setState({
      filteredAndOrderedTokensList: orderedList,
    });
  }

  /**
   * Updates the rendered state list with the filtered and ordered array
   */
  async updateRenderedList(finalList) {
    await this.setState({
      renderedList: this.buildTokenLines(
        finalList.slice(0, this.state.scrollMaxItems)
      ),
    });
  }

  /**
   * Opens or close the filtering pannels
   * @param {String} filterType - Signifies which filter we need to toggle/set
   */
  async toggleFilterPannel(filterType) {
    await this.setState({
      filteringType:
        filterType === this.state.filteringType ? null : filterType,
    });
  }

  /**
   * Builds the HTML for a given token accounts List
   * @param {Array} tokensList - List of tokens account hoolder
   * @returns {Object} - An HTML template of all the lines contained in the table for the tokens accounts in the list
   */
  buildTokenLines(tokensList) {
    return tokensList.map((tokenItem) => {
      const flagUrl = FLAG_URL_TEMPLATE.replace(
        "{{COUNTRY_CODE}}",
        tokenItem.Country.toUpperCase()
      );
      return (
        <tr className="tokens-list-line-container" key={tokenItem.guid}>
          <td className="tokens-list-column-long">{`${tokenItem["First Name"]} ${tokenItem["Last Name"]}`}</td>
          <td className="tokens-list-column-short">
            <img
              alt={tokenItem.Country}
              className="token-list-flag-icon"
              src={flagUrl}
            />
            {tokenItem.Country}
          </td>
          <td className="tokens-list-column-short">{tokenItem.amt}</td>
          <td className="tokens-list-column-short">
            {tokenItem.mfa !== "null" ? tokenItem.mfa : ""}
          </td>
          <td className="tokens-list-column-long">
            {tokenItem.email.toLowerCase()}
          </td>
          <td className="tokens-list-column-long">{tokenItem.dob}</td>
          <td className="tokens-list-column-long">{tokenItem.createdDate}</td>
          <td className="tokens-list-column-long">
            {tokenItem.ReferredBy ? tokenItem.ReferredBy.toLowerCase() : ""}
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className="tokens-list-table" cellSpacing="0">
        <thead>
          {/* This section contains the header of the table and all the titles */}
          <tr className="tokens-list-header-container">
            <th className="tokens-list-column-long">Name</th>
            <th className="tokens-list-column-short">
              <div className="tokens-list-text">Country</div>
              <div
                className={
                  this.state.filters[TOKENS_FILTER_TYPE.COUNTRY].length > 0
                    ? "tokens-list-icon tokens-list-icon-active"
                    : "tokens-list-icon"
                }
                onClick={() =>
                  this.toggleFilterPannel(TOKENS_FILTER_TYPE.COUNTRY)
                }
              >
                <Filter size="1.2em" />
              </div>
              {/* The filter popover is the pannel used to select or deselect options from the filtering menu */}
              <FilterPopover
                filterList={this.countryFilterList}
                active={this.state.filteringType === TOKENS_FILTER_TYPE.COUNTRY}
                onChange={this.onFilterChange}
              />
            </th>
            <th className="tokens-list-column-short">
              <div className="tokens-list-text">Amount</div>
              <div
                className={
                  this.state.orderingType === TOKENS_ORDER_TYPE.AMOUNT
                    ? "tokens-list-icon tokens-list-icon-active"
                    : "tokens-list-icon"
                }
                onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.AMOUNT)}
              >
                {this.state.orderingType === TOKENS_ORDER_TYPE.AMOUNT &&
                this.state.orderingDirection === 1 ? (
                  <SortAmountDown size="1.2em" />
                ) : (
                  <SortAmountUp size="1.2em" />
                )}
              </div>
            </th>
            <th className="tokens-list-column-short">
              <div className="tokens-list-text">MFA Type</div>
              <div
                className={
                  this.state.filters[TOKENS_FILTER_TYPE.MFA].length > 0
                    ? "tokens-list-icon tokens-list-icon-active"
                    : "tokens-list-icon"
                }
                onClick={() => this.toggleFilterPannel(TOKENS_FILTER_TYPE.MFA)}
              >
                <Filter size="1.2em" />
              </div>
              {/* The filter popover is the pannel used to select or deselect options from the filtering menu */}
              <FilterPopover
                filterList={this.mfaFilterList}
                active={this.state.filteringType === TOKENS_FILTER_TYPE.MFA}
                onChange={this.onFilterChange}
              />
            </th>
            <th className="tokens-list-column-long">Email</th>
            <th className="tokens-list-column-long">Date of Birth</th>
            <th className="tokens-list-column-long">
              <div className="tokens-list-text">Date Created</div>
              <div
                className={
                  this.state.orderingType === TOKENS_ORDER_TYPE.DATE_CREATED
                    ? "tokens-list-icon tokens-list-icon-active"
                    : "tokens-list-icon"
                }
                onClick={() =>
                  this.setOrderType(TOKENS_ORDER_TYPE.DATE_CREATED)
                }
              >
                {this.state.orderingType === TOKENS_ORDER_TYPE.DATE_CREATED &&
                this.state.orderingDirection === 1 ? (
                  <SortAmountDown size="1.2em" />
                ) : (
                  <SortAmountUp size="1.2em" />
                )}
              </div>
            </th>
            <th className="tokens-list-column-long">ReferredBy</th>
          </tr>
        </thead>
        {this.state.isLoading ? (
          /* If the component is currently loading, hide the default list and show the loading*/
          <tbody id="tokens-list-body">
            <tr className="tokens-list-no-result-line">
              <td colSpan="8" className="tokens-list-no-result-column">
                <img src={loadingGif} height="30" />
              </td>
            </tr>
          </tbody>
        ) : (
          /* If the component is not currently loading, show the default list*/
          <tbody id="tokens-list-body" onScroll={(e) => this.onListScroll(e)}>
            {/* This sections is for the main table, which displays a message if no item are in the table */}
            {this.state.filteredAndOrderedTokensList.length > 0 ? (
              this.state.renderedList
            ) : (
              <tr className="tokens-list-no-result-line">
                <td colSpan="8" className="tokens-list-no-result-column">
                  Oops! It seems like there are no results for the parameters
                  provided.
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
    );
  }
}

TokensList.propTypes = {
  isDatasetLarge: PropTypes.bool,
  searchValue: PropTypes.string,
  isLoading: PropTypes.bool,
};
