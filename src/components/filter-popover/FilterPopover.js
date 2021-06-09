import './FilterPopover.css';
import React from 'react';

export class FilterPopover extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectAllClicked = this.onSelectAllClicked.bind(this);
        const formattedFilterList = props.filterList.map( filterItem => ({ ...filterItem, active: true}));

        this.state = {
            active: props.active,
            filterList: formattedFilterList,
            isSelectAllActive: false,
        }
    }
    
    async componentWillReceiveProps(nextProps) {
        await this.setState({ active: nextProps.active });
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
                {
                    this.state.filterList.map( filterItem => {
                        return <div className="tokens-list-popover-line" key={filterItem.ref}>
                                        <input type="checkbox" checked={filterItem.active} onChange={(e) => this.onFilterCheckboxClicked(filterItem)}/>
                                <div className="tokens-list-popover-text" onClick={(e) => this.onFilterCheckboxClicked(filterItem)}>{filterItem.text}</div>
                            </div>
                    })
                }
            </div>
        );
    }
}