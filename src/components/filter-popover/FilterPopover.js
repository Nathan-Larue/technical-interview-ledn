import "./FilterPopover.css";
import PropTypes from "prop-types";
import React from "react";

export class FilterPopover extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectAllClicked = this.onSelectAllClicked.bind(this);

    this.state = {
      active: props.active,
      filterList: this.formatFilterList(props.filterList),
      isSelectAllActive: false,
    };
  }

  /**
   * Whenever the props get updated, update if the pannel is active or the list of filtering options
   * @param {Object} prevProps - Object containing all the props before the update
   */
  async componentDidUpdate(prevProps) {
    // If the pannel is active, update the state
    if (prevProps.active !== this.props.active) {
      await this.setState({
        active: this.props.active,
      });
    }

    // If the list of filtered options changes, update it
    if (prevProps.filterList !== this.props.filterList) {
      await this.setState({
        filterList: this.formatFilterList(this.props.filterList),
        isSelectAllActive: false,
      });
    }
  }

  /**
   * Format the filtering options for the pannel according to the list received
   * @param {Array} filterList - List of filters received by the parent component
   * @returns {Array} - The list of filters to render with the appropriate parameters and order
   */
  formatFilterList(filterList) {
    return filterList
      .map((filterItem) => ({ ...filterItem, active: true }))
      .sort((itemA, itemB) => {
        if (itemA.ref.toLowerCase() < itemB.ref.toLowerCase()) {
          return -1;
        }
        if (itemA.ref.toLowerCase() > itemB.ref.toLowerCase()) {
          return 1;
        }
        return 0;
      });
  }

  /**
   * Whenever the select/unselect all button is clicked, update the filters accordingly
   */
  async onSelectAllClicked() {
    // Reassign the entire list
    await this.setState({ isSelectAllActive: !this.state.isSelectAllActive });
    const reassignedList = this.state.filterList.map((filterItem) => ({
      ...filterItem,
      active: !this.state.isSelectAllActive,
    }));

    // Update the list and notify the parent component
    this.setState({ filterList: reassignedList });
    this.props.onChange(this.state.filterList);
  }

  /**
   * Whenever a filtering option is clicked, update the states and if select all should be triggered
   * @param {List} filterItem - The filtering object received
   */
  onFilterCheckboxClicked(filterItem) {
    filterItem.active = !filterItem.active;
    this.setState({
      isSelectAllActive: this.state.filterList.some(
        (item) => item.active === false
      ),
    });
    this.props.onChange(this.state.filterList);
  }

  render() {
    return (
      <div
        className={`tokens-list-popover ${
          !this.state.active ? "tokens-list-popover-inactive" : ""
        }`}
      >
        <div className="tokens-list-popover-line tokens-list-popover-spacer">
          <div
            className="token-list-popover-button"
            onClick={this.onSelectAllClicked}
          >
            {this.state.isSelectAllActive ? "Select all" : "Unselect all"}
          </div>
        </div>
        <div className="token-list-popover-options-container">
          {this.state.filterList.map((filterItem) => {
            return (
              <div className="tokens-list-popover-line" key={filterItem.ref}>
                <input
                  type="checkbox"
                  checked={filterItem.active}
                  onChange={() => this.onFilterCheckboxClicked(filterItem)}
                />
                <div
                  className="tokens-list-popover-text"
                  onClick={() => this.onFilterCheckboxClicked(filterItem)}
                >
                  {filterItem.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

FilterPopover.propTypes = {
  active: PropTypes.bool,
  filterList: PropTypes.array,
  onChange: PropTypes.func,
};
