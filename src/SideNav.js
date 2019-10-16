import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './SideNav.css';

class SideNav extends React.Component {

    state = {
        startDate: new Date(),
        showFavorites: false, 
        showFolders: false,
        filterInterval: null, 
        flaggedEmail: false,
        attachment: false,
        seen: false,
        favorites: ["Favorite 1", "Favorite 2"],
        folders: ["Folder 1", "Folder 2"], 
        selectedFavorite: null,
        selectedFolder: null, 
        newFavoriteName: null
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(props) {
        this.setState({ 
            newFavoriteName: props.saveFavorite
        });
        if (this.state.newFavoriteName != null && props.saveFavorite != false) {
            this.handleSaveFavorite(props.saveFavorite);
        }
    }

    handleStartChange = date => {
        this.setState({
            startDate: date
        });
    };

    handleIntervalBtnClick = event => {
        this.setState({
            filterInterval: event.target.value
        })
    }

    handleToggleFavorites = () => {
        this.setState({
            showFavorites: !this.state.showFavorites
        })
    }

    handleSelectFavorite = event => {
        this.setState({
            selectedFavorite: event.target.innerText
        })
    }

    handleAddFavorite = () => {
        this.props.onAddFavorite(true);
    }

    handleSaveFavorite = (favoriteName) => {
        //todo: send message to engine with favorite data
        //todo: attachment boolean? flagged email?
        var jsonObj = `
        { "MessageType":"AddFavorites",
	        "FavoriteName": "` + favoriteName + `" ,
	        "Filter": {
		        "FolderName": "` + this.state.selectedFolder + `",
		        "Date": "` + this.state.startDate + `",
		        "Interval": "` + this.state.filterInterval + `",
		        "Attachment":"` +  this.state.attachment +`",
                "Seen":"` + this.state.seen + `"
            }
        }`;
        this.setState({
            newFavoriteName: null
        })
    }

    handleToggleFolders = () => {
        this.setState({
            showFolders: !this.state.showFolders
        })
    }

    handleSelectFolder = event => {
        this.setState({
            selectedFolder: event.target.innerText
        })
    }

    handleFlaggedCheckmark = () => {
        this.setState({
            flaggedEmail: !this.state.flaggedEmail
        })
    }

    handleAttachmentCheckmark = () => {
        this.setState({
            attachment: !this.state.attachment
        })
    }

    handleSeenCheckmark = () => {
        this.setState({
            seen: !this.state.seen
        })
    }

    clearFilter = () => {
        this.setState({
            startDate: new Date(),
            filterInterval: null,
            flaggedEmail: false,
            attachment: false,
            seen: false
        })
    }

    render() {
        return (
            <div className="sidenav">
                <a className="alt" onClick={this.handleToggleFavorites}>Favorites
                        <span className="caret"
                        style={this.state.showFavorites ? { display: 'none' } : {}}
                        onClick={this.handleToggleFavorites}>
                    </span>
                    <span className="caret-up"
                        style={!this.state.showFavorites ? { display: 'none' } : {}}
                        onClick={this.handleToggleFavorites}>
                    </span>
                </a>
                <div style={!this.state.showFavorites ? { display: 'none' } : {}}>
                    <ul className="sidenav-lists">
                        {
                            this.state.favorites.map(el => 
                                <li value={el} 
                                    className="item"
                                    style={el === this.state.selectedFavorite ? { color: '#f8ce74' } : { color: 'white' }}
                                    onClick={this.handleSelectFavorite}> {el} 
                                </li>)
                        }
                    </ul>
                </div>
                <a onClick={this.handleToggleFolders}>Folders
                        <span className="caret"
                        style={this.state.showFolders ? { display: 'none' } : {}}>
                    </span>
                    <span className="caret-up"
                        style={!this.state.showFolders ? { display: 'none' } : {}}>
                    </span>
                </a>
                <div style={!this.state.showFolders ? { display: 'none' } : {}}>
                    <ul className="sidenav-lists">
                        {
                            this.state.folders.map(el => 
                            <li value={el}
                            className="item"
                            style={el === this.state.selectedFolder ? { color: '#f8ce74' } : { color: 'white' }}
                            onClick={this.handleSelectFolder}> {el} 
                            </li>)
                        }
                    </ul>
                </div>
                <a className="alt">Filters
                        <span className="clearMsg" onClick={this.clearFilter}>Clear Filter</span>
                </a>
                <div className="sidenav-contents">
                    Start Date: <br></br>
                    <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleStartChange}
                    />
                    <br></br>
                    <br></br>
                    Set Interval: <br></br>
                    <div className="btnsGroup">
                        <button className="intervalBtn"
                            value="week"
                            style={"week" === this.state.filterInterval ? { backgroundColor: '#F6BC3D' } : { backgroundColor: 'white' }}
                            onClick={this.handleIntervalBtnClick}>
                            Week
                            </button>
                        <button className="intervalBtn"
                            value="month"
                            style={"month" === this.state.filterInterval ? { backgroundColor: '#F6BC3D' } : { backgroundColor: 'white' }}
                            onClick={this.handleIntervalBtnClick}>
                            Month
                            </button>
                        <button className="intervalBtn"
                            value="year"
                            style={"year" === this.state.filterInterval ? { backgroundColor: '#F6BC3D' } : { backgroundColor: 'white' }}
                            onClick={this.handleIntervalBtnClick}>
                            Year
                        </button>
                    </div>
                    <br></br><br></br>
                    Contains: <br></br>
                    <div className="containsGroup">
                        <label className="container"> Flagged Email
                                <input type="checkbox"
                                checked={this.state.flaggedEmail}
                                onClick={this.handleFlaggedCheckmark}></input>
                            <span className="checkmark"></span>
                        </label>
                        <br></br>
                        <label className="container"> Attachment
                                <input type="checkbox"
                                checked={this.state.attachment}
                                onClick={this.handleAttachmentCheckmark}></input>
                            <span className="checkmark"></span>
                        </label>
                        <br></br>
                        <label className="container"> Seen
                                <input type="checkbox"
                                checked={this.state.seen}
                                onClick={this.handleSeenCheckmark}></input>
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div>
                        <br></br><br></br>
                        <button className="intervalBtn">
                            Go
                        </button>
                        <button className="intervalBtn" onClick={this.handleAddFavorite}>
                            Add Favorite
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SideNav;