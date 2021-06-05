import './Tokens.css';
import React from 'react';
import {Add, Download} from '@icon-park/react';

export class Tokens extends React.Component {
    render(){
        return (
            <div className="token-page">
                <div className="token-header-container">
                    <input type="text" className="token-header-search" placeholder="search by name"/>
                    <button className="token-header-button">
                        <div className="token-header-button-icon-wrapper">
                            <Add/>
                        </div>
                        <div className="token-header-button-text-wrapper">
                            TOKENS
                        </div>
                    </button>
                    <button className="token-header-button">
                        <div className="token-header-button-icon-wrapper">
                            <Download/>
                        </div>
                        <div className="token-header-button-text-wrapper">
                            CSV
                        </div>
                    </button>
                </div>
            </div>
        );
    }
}