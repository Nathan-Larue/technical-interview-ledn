import './TokensList.css';
import tokensList from '../../assets/accounts.json'
import React from 'react';
import {SortAmountDown, SortAmountUp, Filter} from '@icon-park/react';
import Flags from 'country-flag-icons/react/3x2'

export class TokensList extends React.Component {
    constructor(props) {
        super(props);
        
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
                                    <SortAmountDown size="1.2em"/>
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
                                    <SortAmountDown size="1.2em"/>
                                </div>
                            </th>
                            <th className="tokens-list-column-long">ReferredBy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokensList.map(value => {
                            const flagUrl = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${value.Country.toUpperCase()}.svg`
                            return <tr className="tokens-list-line-container">
                                    <td className="tokens-list-column-short">{value['First Name']}</td>
                                    <td className="tokens-list-column-short">{value['Last Name']}</td>
                                    <td className="tokens-list-column-short">
                                        <img alt="United States"
                                            className="token-list-flag-icon"
                                            src={flagUrl}/> 
                                        {value.Country}
                                    </td>
                                    <td className="tokens-list-column-short">{value.amt}</td>
                                    <td className="tokens-list-column-short">{value.mfa !== 'null' ? value.mfa : ''}</td>
                                    <td className="tokens-list-column-long">{value.email.toLowerCase()}</td>
                                    <td className="tokens-list-column-long">{value.dob}</td>
                                    <td className="tokens-list-column-long">{value.createdDate}</td>
                                    <td className="tokens-list-column-long">{value.ReferredBy}</td>
                                </tr>
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}