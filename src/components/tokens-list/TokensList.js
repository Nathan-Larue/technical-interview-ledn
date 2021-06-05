import './TokensList.css';
import tokensList from '../../assets/accounts.json'
import React from 'react';
import Flags from 'country-flag-icons/react/3x2'

export class TokensList extends React.Component {
    constructor(props) {
    super(props);
    }
    render(){
        return (
            <div className="tokens-list-wrapper">
                <table className="tokens-list-table" cellSpacing="0">
                    <tbody>
                        <tr className="tokens-list-header-container">
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Country</th>
                            <th>Email</th>
                            <th>Date of Birth</th>
                            <th>MFA Type</th>
                            <th>Amount</th>
                            <th>Date Created</th>
                            <th>ReferredBy</th>
                        </tr>
                        {tokensList.map(value => {
                            const flagUrl = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${value.Country.toUpperCase()}.svg`
                            return <tr className="tokens-list-line-container">
                                    <td>{value['First Name']}</td>
                                    <td>{value['Last Name']}</td>
                                    <td>
                                        <img alt="United States"
                                            className="token-list-flag-icon"
                                            src={flagUrl}/> 
                                        {value.Country}
                                    </td>
                                    <td>{value.email.toLowerCase()}</td>
                                    <td>{value.dob}</td>
                                    <td>{value.mfa !== 'null' ? value.mfa : ''}</td>
                                    <td>{value.amt}</td>
                                    <td>{value.createdDate}</td>
                                    <td>{value.ReferredBy}</td>
                                </tr>
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}