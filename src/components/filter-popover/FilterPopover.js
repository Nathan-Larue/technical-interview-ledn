import './FilterPopover.css';
import PropTypes from 'prop-types';
import React from 'react';

FilterPopover.propTypes = {
    active: PropTypes.bool,
    filterList: PropTypes.array,
    onChange: PropTypes.func,
}

export class FilterPopover extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectAllClicked = this.onSelectAllClicked.bind(this);

        this.state = {
            active: props.active,
            filterList: this.formatFilterList(props.filterList),
            isSelectAllActive: false,
        }
    }

    formatFilterList(filterList){
        return filterList.map( filterItem => ({ ...filterItem, active: true})).sort(function(itemA, itemB) {
            if ( itemA.ref.toLowerCase() < itemB.ref.toLowerCase() ){
                return -1;
            }
            if ( itemA.ref.toLowerCase() > itemB.ref.toLowerCase() ){
                return 1;
            }
            return 0;
        });
    }
    
    async componentDidUpdate(prevProps) {
        if(prevProps.active !== this.props.active){
            await this.setState({ 
                active: this.props.active,
            });
        }

        if(prevProps.filterList !== this.props.filterList){
            await this.setState({ 
                filterList: this.formatFilterList(this.props.filterList),
                isSelectAllActive: false,
            });
        }
    }

    async onSelectAllClicked() {
        // Reassign the entire list
        await this.setState({ isSelectAllActive: !this.state.isSelectAllActive });
        const reassignedList = this.state.filterList.map( filterItem => ({...filterItem, active: !this.state.isSelectAllActive}));
        this.setState({ filterList: reassignedList });
        this.props.onChange(this.state.filterList);
    }

    onFilterCheckboxClicked(filterItem) {
        filterItem.active = !filterItem.active;
        this.setState({ isSelectAllActive: this.state.filterList.some(item => item.active === false) });
        this.props.onChange(this.state.filterList);
    }

    render() {
        return (
            <div className={`tokens-list-popover ${!this.state.active ? 'tokens-list-popover-inactive' : ''}`}>
                <div className="tokens-list-popover-line tokens-list-popover-spacer">
                    <div className="token-list-popover-button" onClick={this.onSelectAllClicked}>{ this.state.isSelectAllActive ? 'Select all' : 'Unselect all'}</div>
                </div>
                <div className="token-list-popover-options-container">
                    {
                        this.state.filterList.map( filterItem => {
                            return <div className="tokens-list-popover-line" key={filterItem.ref}>
                                            <input type="checkbox" checked={filterItem.active} onChange={() => this.onFilterCheckboxClicked(filterItem)}/>
                                    <div className="tokens-list-popover-text" onClick={() => this.onFilterCheckboxClicked(filterItem)}>{filterItem.text}</div>
                                </div>
                        })
                    }
                </div>
            </div>
        );
    }
}