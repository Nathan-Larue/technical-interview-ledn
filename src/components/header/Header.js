import './Header.css';
import React from 'react';
import ledn_logo from '../../assets/ledn_white.svg';
import {Home, Wallet, Bitcoin, Dollar, Exchange, HoldSeeds, CooperativeHandshake} from '@icon-park/react';


export class Header extends React.Component {
    render(){
        return (
            <div className="header">
                <div className="ledn-logo-wrapper">
                    <img src={ledn_logo} className="ledn-logo" alt="logo" />
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <Home fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>DASHBOARD</span>
                    </div>
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <Wallet fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>TOKENS</span>
                    </div>
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <Bitcoin fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>BTC SAVINGS</span>
                    </div>
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <Dollar fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>USDC SAVINGS</span>
                    </div>
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <Exchange fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>B2X</span>
                    </div>
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <HoldSeeds fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>BORROW</span>
                    </div>
                </div>
                
                <div className="header-button">
                    <div className="header-button-icon">
                        <CooperativeHandshake fill="white"/>
                    </div>
                    <div className="header-button-text">
                        <span>REFERRALS</span>
                    </div>
                </div>
            </div>
        );
    }
}