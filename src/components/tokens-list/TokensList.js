import './TokensList.css';
import tokensList from '../../assets/accounts.json'
import largeTokensList from '../../assets/accounts_large.json'
import React from 'react';
import {SortAmountDown, SortAmountUp, Filter} from '@icon-park/react';
import {TOKENS_ORDER_TYPE, TOKENS_FILTER_TYPE, BASE_STATE} from './TokensList.definitions.js';
import {FilterPopover} from '../filter-popover/FilterPopover.js'
import { uuid } from 'uuidv4';
import PropTypes from 'prop-types';

const FLAG_URL_TEMPLATE = `http://purecatamphetamine.github.io/country-flag-icons/3x2/{{COUNTRY_CODE}}.svg`

TokensList.propTypes = {
    isDatasetLarge: PropTypes.bool,
    searchValue: PropTypes.string,
}

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
            renderedList: this.buildTokenLines(this.keyedTokensList.slice(0, BASE_STATE.scrollMaxItems)),
        }
    }

    resetState(isDatasetLarge){
        const dataset = isDatasetLarge ? largeTokensList : tokensList;

        // Added a guid for each individual tokens and made it immutable
        this.keyedTokensList = this.addKeyToFilterList(dataset);
        this.countryFilterList = this.getCountryFiltersList(dataset); 
        this.mfaFilterList = this.getMfaFiltersList(dataset);

        // Initiate the state
        this.setState({
            ...BASE_STATE,
            filteredTokensList: this.keyedTokensList,
            filteredAndOrderedTokensList: this.keyedTokensList,
            renderedList: this.buildTokenLines(this.keyedTokensList.slice(0, BASE_STATE.scrollMaxItems)),
            isDatasetLarge: this.props.isDatasetLarge,
        });
    }

    addKeyToFilterList(filterList){
        // Added a guid for each individual tokens and made it immutable
        return filterList.map(tokenItem => ({
            ...tokenItem, 
            guid: uuid()
        }));
    }

    getCountryFiltersList(filterList){
        return [...new Set(filterList.map(tokenItem => tokenItem.Country.toUpperCase()))].map(countryCode => {
            const flagUrl = FLAG_URL_TEMPLATE.replace('{{COUNTRY_CODE}}', countryCode);
            return {
                ref: countryCode,
                text: <div><img alt={countryCode} className="token-list-flag-icon" src={flagUrl}/> {` ${countryCode}`}</div>
            };
        });
    }

    getMfaFiltersList(filterList){
        return [...new Set(filterList.map(tokenItem => tokenItem.mfa))].map( mfaItem =>
            ({
                ref: mfaItem,
                text: mfaItem === "null" ? "None" : mfaItem
            })
        );
    }

    async onListScroll(event){
        if(
            (event.target.scrollTop + event.target.offsetHeight) > (event.target.scrollHeight - 300) &&            
            this.state.scrollMaxItems < this.state.filteredAndOrderedTokensList.length
        ) {
            await this.setState({ scrollMaxItems: this.state.scrollMaxItems + 50 })
            await this.updateRenderedList(this.state.filteredAndOrderedTokensList);
        }
    }
    
    async componentDidUpdate(prevProps) {
        if(this.props.searchValue !== prevProps.searchValue){
            // Update searchValue
            await this.setState({ searchValue: this.props.searchValue });

            // Refilter the list, order it and then render it
            await this.filterTokensList();
            await this.orderTokensList();
            this.updateRenderedList(this.state.filteredAndOrderedTokensList);

        }
        if(this.props.isDatasetLarge !== prevProps.isDatasetLarge){
            await this.setState({ isDatasetLarge: this.props.isDatasetLarge });
            this.resetState(this.props.isDatasetLarge);
            await this.updateRenderedList(this.state.filteredAndOrderedTokensList);
        }
    }

    async filterTokensList(){
        const filteredList = this.keyedTokensList.filter( TokenItem => 
            this.isTokenNameValid(TokenItem) &&
            this.isTokenCountryValid(TokenItem) &&
            this.isTokenMfaValid(TokenItem)
        );

        await this.setState({ filteredTokensList: filteredList });
    }

    isTokenNameValid(tokenItem){
        const firstname = tokenItem['First Name'].toLowerCase();
        const lastname = tokenItem['Last Name'].toLowerCase();
        const fullname = `${tokenItem['First Name']} ${tokenItem['Last Name']}`.toLowerCase();
        const searchValue = this.state.searchValue.toLowerCase();

        return firstname.startsWith(searchValue) ||
            lastname.startsWith(searchValue) ||
            fullname.startsWith(searchValue)
    }

    isTokenCountryValid(tokenItem){
        return !this.state.filters[TOKENS_FILTER_TYPE.COUNTRY].includes(tokenItem.Country);
    }

    isTokenMfaValid(tokenItem){
        return !this.state.filters[TOKENS_FILTER_TYPE.MFA].includes(tokenItem.mfa);
    }

    async setOrderType(orderingType){
        await this.setState({ 
            orderingType: orderingType,
            orderingDirection: orderingType === this.state.orderingType ? -this.state.orderingDirection : 1,
        })

        await this.orderTokensList();
        this.updateRenderedList(this.state.filteredAndOrderedTokensList);
    }

    // In order to minimize the amount of work that the ordering has to do, we are not filtering again
    async orderTokensList(){

        const orderedList = this.state.filteredTokensList.sort( (tokenA, tokenB) => {
            if ( tokenA[this.state.orderingType] < tokenB[this.state.orderingType] ){
                return -this.state.orderingDirection;
            }
            if ( tokenA[this.state.orderingType] > tokenB[this.state.orderingType] ){
            return this.state.orderingDirection;
            }
            return 0;
        });

        await this.setState({ 
            filteredAndOrderedTokensList: orderedList,
        });
    }

    async updateRenderedList(finalList){
        await this.setState({ 
            renderedList: this.buildTokenLines(finalList.slice(0, this.state.scrollMaxItems)),
        });
    }

    async toggleFilterPannel(filterType){        
        await this.setState({ filteringType: filterType === this.state.filteringType ? null : filterType, });
    }

    buildTokenLines(tokensList) {
        return tokensList.map(tokenItem => {
            const flagUrl = FLAG_URL_TEMPLATE.replace('{{COUNTRY_CODE}}', tokenItem.Country.toUpperCase());
            return (
                <tr className="tokens-list-line-container" key={tokenItem.guid}>
                    <td className="tokens-list-column-long">{`${tokenItem['First Name']} ${tokenItem['Last Name']}`}</td>
                    <td className="tokens-list-column-short">
                        <img alt={tokenItem.Country}
                            className="token-list-flag-icon"
                            src={flagUrl}/> 
                        {tokenItem.Country}
                    </td>
                    <td className="tokens-list-column-short">{tokenItem.amt}</td>
                    <td className="tokens-list-column-short">{tokenItem.mfa !== 'null' ? tokenItem.mfa : ''}</td>
                    <td className="tokens-list-column-long">{tokenItem.email.toLowerCase()}</td>
                    <td className="tokens-list-column-long">{tokenItem.dob}</td>
                    <td className="tokens-list-column-long">{tokenItem.createdDate}</td>
                    <td className="tokens-list-column-long">{tokenItem.ReferredBy ? tokenItem.ReferredBy.toLowerCase() : ''}</td>
                </tr>
            )
        });
    }

    async onFilterChange(filtersList){
        const filters = {
            ...this.state.filters,
            [this.state.filteringType]: filtersList.filter( filterItem => !filterItem.active).map( filterItem => filterItem.ref),
        };

        await this.setState({ filters, });
        await this.filterTokensList();
        await this.orderTokensList();
        this.updateRenderedList(this.state.filteredAndOrderedTokensList);
    }

    getFinalList(){
        return this.state.filteredAndOrderedTokensList;
    }

    render(){
        return (
            <table className="tokens-list-table" cellSpacing="0">
                <thead>
                    <tr className="tokens-list-header-container">
                        <th className="tokens-list-column-long">Name</th>
                        <th className="tokens-list-column-short">
                            <div className="tokens-list-text">Country</div>
                            <div className={ this.state.filters[TOKENS_FILTER_TYPE.COUNTRY].length > 0 ? 'tokens-list-icon tokens-list-icon-active' : 'tokens-list-icon'} 
                                onClick={() => this.toggleFilterPannel(TOKENS_FILTER_TYPE.COUNTRY)}>
                                <Filter size="1.2em"/>
                            </div>
                            <FilterPopover 
                                filterList={this.countryFilterList} 
                                active={this.state.filteringType === TOKENS_FILTER_TYPE.COUNTRY}
                                onChange={this.onFilterChange}
                            />
                        </th>
                        <th className="tokens-list-column-short">
                            <div className="tokens-list-text">Amount</div>
                            <div className={this.state.orderingType === TOKENS_ORDER_TYPE.AMOUNT ? 'tokens-list-icon tokens-list-icon-active' : 'tokens-list-icon'} 
                                onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.AMOUNT)}>
                                {
                                    this.state.orderingType === TOKENS_ORDER_TYPE.AMOUNT && this.state.orderingDirection === 1 ?
                                        <SortAmountDown size="1.2em"/> :
                                        <SortAmountUp size="1.2em"/>
                                }
                            </div>
                            
                        </th>
                        <th className="tokens-list-column-short">
                            <div className="tokens-list-text">MFA Type</div>
                            <div className={ this.state.filters[TOKENS_FILTER_TYPE.MFA].length > 0  ? 'tokens-list-icon tokens-list-icon-active' : 'tokens-list-icon'} 
                                onClick={() => this.toggleFilterPannel(TOKENS_FILTER_TYPE.MFA)}>
                                <Filter size="1.2em"/>
                            </div>
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
                            <div className={this.state.orderingType === TOKENS_ORDER_TYPE.DATE_CREATED ? 'tokens-list-icon tokens-list-icon-active' : 'tokens-list-icon'} 
                                onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.DATE_CREATED)}>
                                {
                                    this.state.orderingType === TOKENS_ORDER_TYPE.DATE_CREATED && this.state.orderingDirection === 1 ?
                                        <SortAmountDown size="1.2em"/> :
                                        <SortAmountUp size="1.2em"/>
                                }
                            </div>
                        </th>
                        <th className="tokens-list-column-long">ReferredBy</th>
                    </tr>
                </thead>
                <tbody id="tokens-list-body" onScroll={e => this.onListScroll(e)}>
                    {
                        this.state.filteredAndOrderedTokensList.length > 0 ?
                        this.state.renderedList :
                        <tr className="tokens-list-no-result-line">
                            <td colSpan="8" className="tokens-list-no-result-column">Oops! It seems like there are no results for the parameters provided.</td>
                        </tr>
                    }
                </tbody>
            </table>
        );
    }
}
