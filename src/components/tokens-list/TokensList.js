import './TokensList.css';
import tokensList from '../../assets/accounts.json'
import React from 'react';
import cloneDeep from "lodash/cloneDeep"
import {SortAmountDown, SortAmountUp, Filter} from '@icon-park/react';
import {TOKENS_ORDER_TYPE} from './TokensList.definitions.js';
import { uuid } from 'uuidv4';

export class TokensList extends React.Component {
    constructor(props) {
        super(props);

        // Added a guid for each individual tokens and made it immutable
        this.keyedTokensList = Object.freeze(tokensList.map(tokenItem => ({
            ...tokenItem, 
            guid: uuid()
        })));


        // Initiate the state
        const initialList = cloneDeep(this.keyedTokensList);
        this.state = {
            orderingType: null,                                         // Determines which column is being sorted
            orderingDirection: null,                                    // Direct the ordering, 1 means from smaller to larger, -1 means larger to smaller
            filteredTokensList: initialList,                   // List of tokens once they are filtered
            filteredAndOrderedTokensList: initialList,         // List of tokens once they are filtered and ordered
            renderedList: this.buildTokenLines(initialList),   // HTML renders of the list
        }
    }

    buildTokenLines(tokensList) {
        return tokensList.map(tokenItem => {
            const flagUrl = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${tokenItem.Country.toUpperCase()}.svg`
            return (
                <tr className="tokens-list-line-container" key={tokenItem.guid}>
                    <td className="tokens-list-column-short">{tokenItem['First Name']}</td>
                    <td className="tokens-list-column-short">{tokenItem['Last Name']}</td>
                    <td className="tokens-list-column-short">
                        <img alt="United States"
                            className="token-list-flag-icon"
                            src={flagUrl}/> 
                        {tokenItem.Country}
                    </td>
                    <td className="tokens-list-column-short">{tokenItem.amt}</td>
                    <td className="tokens-list-column-short">{tokenItem.mfa !== 'null' ? tokenItem.mfa : ''}</td>
                    <td className="tokens-list-column-long">{tokenItem.email.toLowerCase()}</td>
                    <td className="tokens-list-column-long">{tokenItem.dob}</td>
                    <td className="tokens-list-column-long">{tokenItem.createdDate}</td>
                    <td className="tokens-list-column-long">{tokenItem.ReferredBy}</td>
                </tr>
            )
        });
    }

    filterTokensList(){

    }

    async setOrderType(orderingType){
        await this.setState({ 
            orderingType: orderingType,
            orderingDirection: orderingType === this.state.orderingType ? -this.state.orderingDirection : 1,
        })

        await this.orderTokensList();
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

        this.updateRenderedList(this.state.filteredAndOrderedTokensList);
    }

    async updateRenderedList(finalList){
        await this.setState({ 
            renderedList: this.buildTokenLines(finalList),
        });
    }

    getOrderingIcon(orderType) {

    }

    render(){
        return (
            <div className="tokens-list-wrapper">
                <table className="tokens-list-table" cellSpacing="0">
                    <thead>
                        <tr className="tokens-list-header-container">
                            <th className="tokens-list-column-short">Firstname</th>
                            <th className="tokens-list-column-short">Lastname</th>
                            <th className="tokens-list-column-short">
                                <div className="tokens-list-text">Country</div>
                                <div className="tokens-list-icon">
                                    <Filter size="1.2em"/>
                                </div>
                            </th>
                            <th className="tokens-list-column-short">
                                <div className="tokens-list-text">Amount</div>
                                <div className="tokens-list-icon">
                                    {
                                        this.state.orderingType === TOKENS_ORDER_TYPE.AMOUNT && this.state.orderingDirection === 1 ?
                                            <SortAmountDown size="1.2em" onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.AMOUNT)}/> :
                                            <SortAmountUp size="1.2em" onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.AMOUNT)}/>
                                    }
                                </div>
                            </th>
                            <th className="tokens-list-column-short">
                                <div className="tokens-list-text">MFA Type</div>
                                <div className="tokens-list-icon">
                                    <Filter size="1.2em"/>
                                </div>
                            </th>
                            <th className="tokens-list-column-long">Email</th>
                            <th className="tokens-list-column-long">Date of Birth</th>
                            <th className="tokens-list-column-long">
                                <div className="tokens-list-text">Date Created</div>
                                <div className="tokens-list-icon">
                                    {
                                        this.state.orderingType === TOKENS_ORDER_TYPE.DATE_CREATED && this.state.orderingDirection === 1 ?
                                            <SortAmountDown size="1.2em" onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.DATE_CREATED)}/> :
                                            <SortAmountUp size="1.2em" onClick={() => this.setOrderType(TOKENS_ORDER_TYPE.DATE_CREATED)}/>
                                    }
                                </div>
                            </th>
                            <th className="tokens-list-column-long">ReferredBy</th>
                        </tr>
                    </thead>
                    <tbody id="tokens-list-body">
                        {this.state.renderedList}
                    </tbody>
                </table>
            </div>
        );
    }
}
