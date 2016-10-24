import React from 'react';
import ReactDOM from 'react-dom';
import DomUtils from './domUtils.js';
import TextField from 'material-ui/TextField';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';
import HitagUtils from './hitagUtils.js';
import Connector from './connector.js';
import Paper from 'material-ui/Paper';


export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            connector:null,
            isOpened :true,
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        this.onNewTag = this.onNewTag.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onTagInputFocus = this.onTagInputFocus.bind(this);
        this.onTagInputBlur = this.onTagInputBlur.bind(this);
        this.checkIfDisplayAutocomplete = this.checkIfDisplayAutocomplete.bind(this);

        this.onListItemSelected = this.onListItemSelected.bind(this);
        this.selectItem = this.selectItem.bind(this);

        this.onAction = this.onAction.bind(this);
        this.onMoveUp = this.onMoveUp.bind(this);
        this.onMoveDown = this.onMoveDown.bind(this);

        this.state = {
            suggestedHitags:[], 
            selectedIndex:-1,
            inputHitag:[],
            suggestionBoxPosition:{top:0,left:0}
        };

        this.hotKeyshandlers = {
          'action': this.onAction,
          'moveUp': this.onMoveUp,
          'moveDown':this.onMoveDown
          //'moveLeft': this.onMoveUp,
          //'moveRight':this.onMoveDown,
        };

        var that = this;

        this.props.connector.registerEvent("updateHitagSuggestions", function(suggestedHitags) {
            that.updateHitagSuggestions(suggestedHitags);
        });  
    }

    updateHitagSuggestions(suggestedHitags)
    {
        var rect = DomUtils.getElementRect(this.refs["inputHitag"],"tagInProgress");
        this.setState(
            {
                suggestedHitags: suggestedHitags,
                suggestionBoxPosition:{ top: rect.top + rect.height, left:rect.left}
            });
    }

    onAction(e)
    {
        console.log("action");
    }

    onMoveUp(e)
    {
        if(this.state.selectedIndex>0)
            this.selectItem(this.state.selectedIndex - 1)
    }
    
    onMoveDown(e)
    {
        if(this.state.selectedIndex< this.state.suggestedHitags.length-1)
            this.selectItem(this.state.selectedIndex + 1)
    }

    onNewTag(newTag)
    {
        var currentHitag = this.state.inputHitag;
        currentHitag.push(newTag);
        this.setState({
            inputHitag : currentHitag,
            inputTag:"",
            selectedIndex:-1
        });

        var inProgressHitag = HitagUtils.getInProgressHitagObject(currentHitag, "");

        this.props.connector.sendMessage("getSuggestedHitags", inProgressHitag);
        this.checkIfDisplayAutocomplete(event.target.value, true);
    }

    onTagInputChanged(inputTag)
    {
        var inProgressHitag = HitagUtils.getInProgressHitagObject(this.state.inputHitag, inputTag);

        this.props.connector.sendMessage("getSuggestedHitags", inProgressHitag);
        this.setState({inputTag : inputTag});
    }

    onEnter(newTag)
    {
        var currentHitag = this.state.inputHitag;
        if(newTag!="")
            currentHitag.push(newTag);

        this.props.connector.sendMessage("setHitagToContent", currentHitag);

        this.setState({
            inputHitag: [],
            inputTag:"",
            selectedIndex:-1
        });

        var inProgressHitag = HitagUtils.getInProgressHitagObject([], "");
        this.props.connector.sendMessage("getSuggestedHitags", inProgressHitag);
        this.checkIfDisplayAutocomplete("", true);
    }

    onTagInputFocus(event)
    {   
        this.checkIfDisplayAutocomplete(event.target.value, true);
    }

    onTagInputBlur(event)
    {
        this.checkIfDisplayAutocomplete(event.target.value, false);
    }

    onListItemSelected(index)
    {
        this.selectItem(index);
    }

    selectItem(index)
    {
        this.setState({
            selectedIndex:index,
            inputTag: HitagUtils.getLastTag(this.state.suggestedHitags[index])
        });

        var selectedItem = this.refs["selectableList"].getSelectedItemNode();
        var paper = ReactDOM.findDOMNode(this.refs["paper"]);
        if(selectedItem)
            paper.scrollTop = selectedItem.offsetTop;

        setTimeout(this.refs["inputHitag"].setCaretAtTheEnd,1);
    }

    checkIfDisplayAutocomplete (tagInputValue, tagInputIsFocused)
    {
        var open = false;

        if(tagInputValue != "" && tagInputIsFocused)
           open = true;

       if(this.state.autocompleteIsOpened != open)
            this.setState({ autocompleteIsOpened:open});
    }

    render()
    {
        var style =
        {
            display: 'flex',
            flexWrap:'nowrap',
            flexDirection:'row'
        };

        var autocompleteStyle = 
        {
            zIndex: 1,
            position: 'fixed',
            top: this.state.suggestionBoxPosition.top,
            left:  this.state.suggestionBoxPosition.left,
            maxHeight:150,
            overflowY:"auto"
        }

        var suggestedHitagsElements = [];

        this.state.suggestedHitags.map(function(item, index)
        {
            suggestedHitagsElements.push(
                <Hitag ref={index}
                    encapsulated = {false}
                    hitag={[HitagUtils.getLastTag(item)]}/>);
        });

        return(
            <HotKeys  style = {{outline:'none'}} handlers = {this.hotKeyshandlers}>

                <Hitag ref="inputHitag"
                    inProgress={true}
                    onNewTag={this.onNewTag.bind(this)}
                    onEnter = {this.onEnter}
                    onTagInputChanged = {this.onTagInputChanged}
                    style={{flex:1}}
                    encapsulated = {false}
                    hitag ={this.state.inputHitag}
                    inputTag={this.state.inputTag}/>

                <Paper ref = "paper" style={style} zDepth={3} style={autocompleteStyle}>
                    <SelectableList ref="selectableList"
                        asList= {true} 
                        children = {suggestedHitagsElements}
                        encapsulated = {false}
                        selectedIndex = {this.state.selectedIndex}
                        onItemSelected = {this.onListItemSelected}/> 
                </Paper>
            </HotKeys>             
        ); 
    }
}