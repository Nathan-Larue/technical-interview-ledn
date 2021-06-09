import './TokensPage.css';
import React from 'react';
import {Add, Reduce, Download} from '@icon-park/react';
import {TokensList} from '../tokens-list/TokensList.js'
import { saveAs } from 'file-saver';


export class TokensPage extends React.Component {
    constructor(props) {
        super(props);
        this.TokensListRef = React.createRef();
        this.toggleDatasetSize = this.toggleDatasetSize.bind(this);

        this.state = {
            searchValue: '',
            isDatasetLarge: false,
        }

        // Bind this to the function to keep it defined
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    async onSearchChange(event) {
        await this.setState({ searchValue: event.target.value });
    }

    async toggleDatasetSize(){
        await this.setState({ isDatasetLarge: !this.state.isDatasetLarge });
    }

    onDownloadCsv(){
        const tokensListState = this.TokensListRef.current.state;

        let csvContent = 'First Name, Last Name, Country, Email, Date of Birth, MFA Type, Amount, Date Created, Referred By\n';
        tokensListState.filteredAndOrderedTokensList.forEach(tokenHolder => {
            Object.keys(tokenHolder).forEach(tokenParameter => {
                if(tokenParameter === 'guid') return;
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
                    <button className="token-header-button" onClick={this.toggleDatasetSize}>
                        <div className="token-header-button-icon-wrapper">
                            {
                                this.state.isDatasetLarge?
                                    <Reduce/>:
                                    <Add/>
                            }
                        </div>
                        <div className="token-header-button-text-wrapper">
                            TOKENS
                        </div>
                    </button>
                    <button className="token-header-button" onClick={() => this.onDownloadCsv()}>
                        <div className="token-header-button-icon-wrapper">
                            <Download/>
                        </div>
                        <div className="token-header-button-text-wrapper">
                            CSV
                        </div>
                    </button>
                </div>
                <div className="token-list-wrapper">
                    <TokensList ref={this.TokensListRef} isDatasetLarge={this.state.isDatasetLarge} searchValue={this.state.searchValue}/>
                </div>
            </div>
        );
    }
}