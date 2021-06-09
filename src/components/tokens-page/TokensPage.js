import './TokensPage.css';
import React from 'react';
import {Add, Download} from '@icon-park/react';
import {TokensList} from '../tokens-list/TokensList.js'
import { saveAs } from 'file-saver';


export class TokensPage extends React.Component {
    constructor(props) {
        super(props);
        this.TokensListRef = React.createRef();

        this.state = {
            searchValue: '',
        }

        // Bind this to the function to keep it defined
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    async onSearchChange(event) {
        await this.setState({ searchValue: event.target.value });
    }

    onDownloadCsv(){
        const tokensListState = this.TokensListRef.current.state;

        let csvContent = 'Name, Country, Amount, MFA Type, Email, Date of Birth, Date Created, ReferredBy\n';
        tokensListState.filteredAndOrderedTokensList.forEach(tokenHolder => {
            Object.keys(tokenHolder).forEach(tokenParameter => {
                csvContent += `${tokenHolder[tokenParameter]}, `;
            });
            csvContent += `\n`;
        });

        const date = new Date();
        var blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        saveAs(blob, `Ledn_Tokens_List_${date.toISOString()}.csv`);
    }

    render(){
        return (
            <div className="token-page">
                <div className="token-header-container">
                    <input 
                        type="text" 
                        className="token-header-search" 
                        placeholder="search by name"
                        value={this.state.searchValue}
                        onChange={this.onSearchChange}
                    />
                    <button className="token-header-button">
                        <div className="token-header-button-icon-wrapper">
                            <Add/>
                        </div>
                        <div className="token-header-button-text-wrapper">
                            TOKENS
                        </div>
                    </button>
                    <button className="token-header-button" onClick={() => this.onDownloadCsv()}>
                        {/* <CSVLink data={tokensListRef.current.getFinalList()}>Download me</CSVLink>; */}
                        <div className="token-header-button-icon-wrapper">
                            <Download/>
                        </div>
                        <div className="token-header-button-text-wrapper">
                            CSV
                        </div>
                    </button>
                </div>
                <div className="token-list-wrapper">
                    <TokensList ref={this.TokensListRef} searchValue={this.state.searchValue}/>
                </div>
            </div>
        );
    }
}