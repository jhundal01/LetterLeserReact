import React from 'react';
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import "react-datepicker/dist/react-datepicker.css";
import './SideNav.css';

class SideNav extends React.Component {

    state = {
        startDate: new Date(),
        showFavorites: true,
        showFolders: true,
        filterInterval: null,
        flaggedEmail: false,
        attachment: false,
        seen: false,
        favorites: [],
        folders: [],
        selectedFavorite: null,
        selectedFolder: null,
        newFavoriteName: null,
        showDeleteFavorites: false
    };

    ws = null;

    email = null;

    constructor(props) {
        super(props);
        this.ws = props.webSocket;
        this.email = localStorage.getItem("email");
    }

    componentWillReceiveProps(props) {
        this.setState({
            newFavoriteName: props.saveFavorite,
            favorites: props.favorites,
            folders: props.folders
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
        var jsonObj = `
        { "messagetype":"callfavorite",
	        "favoritename": "` + event.target.innerText + `" 
        }`;
        var favObj = [event.target.innerText];
        this.props.onSelectFavorite(favObj);
        this.ws.send(JSON.stringify(jsonObj));
    }

    handleAddFavorite = () => {
        this.props.onAddFavorite(true);
    }

    handleSaveFavorite = (favoriteName) => {
        //todo: attachment boolean? flagged email?
        var jsonObj = `
        { "MessageType":"AddFavorites",
	        "FavoriteName": "` + favoriteName + `" ,
	        "Filter": {
		        "FolderName": "` + this.state.selectedFolder + `",
		        "Date": "` + this.state.startDate + `",
		        "Interval": "` + this.state.filterInterval + `",
		        "Attachment":"` + this.state.attachment + `",
                "Seen":"` + this.state.seen + `"
            }
        }`;
        this.setState({
            newFavoriteName: null
        })
        this.ws.send(JSON.stringify(jsonObj));
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

    handleEditFavorites = () => {
        this.setState({
            showDeleteFavorites: true
        })
    }

    doneEditingFavorites = () => {
        this.setState({
            showDeleteFavorites: false
        })
    }

    deleteFavorite = (event) => {
        var fav = event.target.parentElement.id;
        let jsonObj =
            `{
                "MessageType": "RemoveFavorite",
                "FavoriteName":` + fav `
            }`;
        this.ws.send(JSON.stringify(jsonObj));
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

    clearFavoriteSelection = () => {
        this.setState({
            selectedFavorite: null
        })
        this.props.onClearFavorite(true);
    }

    sendFilter = () => {
        let jsonObj =
            `{
                "email":"` + this.email +`",
                "messagetype": "filter",
                "filter": {
                    "foldername": "` + this.state.selectedFolder + `",
                    "date": "` + this.state.startDate + `",
                    "interval": "` + this.state.filterInterval + `",
                    "attachment": "` + this.state.attachment + `",
                    "seen": "` + this.state.seen + `"
                }
            }`;
        this.ws.send(jsonObj);
    }

    render() {
        return (
            <div className="sidenav">
                <a className="alt">Favorites
                        <span className="caret"
                        style={this.state.showFavorites ? { display: 'none' } : {}}
                        onClick={this.handleToggleFavorites}>
                    </span>
                    <span className="caret-up"
                        style={!this.state.showFavorites ? { display: 'none' } : {}}
                        onClick={this.handleToggleFavorites}>
                    </span>
                    <span className="space" >&nbsp; &nbsp;</span>
                    <span className="clearMsg" onClick={this.clearFavoriteSelection}>Clear Selection</span>
                </a>
                <div style={!this.state.showFavorites ? { display: 'none' } : {}}>
                    <ul className="sidenav-lists">
                        {
                            this.state.favorites.map(el =>
                                <li value={el}
                                    className="item"
                                    style={el === this.state.selectedFavorite ? { color: '#f8ce74' } : { color: 'white' }}>
                                    <span className="deleteIcon" 
                                    onClick={this.deleteFavorite}
                                    id={el}
                                    style={this.state.showDeleteFavorites ? { display: 'inline'} : { display: 'none'}}>
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                        &nbsp; &nbsp;
                                    </span>
                                    <span onClick={this.handleSelectFavorite}>
                                        {el}
                                    </span>
                                </li>
                            )
                        }
                    </ul>
                    <button 
                    style={ !this.state.showDeleteFavorites ? { display: 'inline'} : {display: 'none'} }
                    className="editBtn" onClick={this.handleEditFavorites}>
                        Edit Favorites
                    </button>
                    <button 
                    style={ this.state.showDeleteFavorites ? { display: 'inline'} : {display: 'none'}}
                    className="editBtn" onClick={this.doneEditingFavorites}>
                        Done
                    </button>
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
                        <button className="intervalBtn" onClick={this.sendFilter}>
                            Go
                        </button>
                        <button className="intervalBtn" onClick={this.handleAddFavorite}>
                            Add Favorite
                        </button>
                    </div>
                    <br></br><br></br>
                </div>
            </div>
        );
    }
}

export default SideNav;