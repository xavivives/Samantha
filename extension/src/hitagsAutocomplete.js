import React from 'react';
import TextField from 'material-ui/TextField';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';
import HitagUtils from './hitagUtils.js';
import Connector from './connector.js';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
            connector:null,
            isOpened :true,
            hitagSuggestions:[]
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
            hitags:[], 
            selectedIndex:0,
            inputHitag:[],
            hitagSuggestions:[]
        };

        this.hotKeyshandlers = {
          'action': this.onAction,
          'moveUp': this.onMoveUp,
          'moveDown':this.onMoveDown,
          'moveLeft': this.onMoveUp,
          'moveRight':this.onMoveDown,
        };

        var that = this;

        this.props.connector.registerEvent("updateHitagSuggestions", function(suggestedHitags) {
            that.updateHitagSuggestions(suggestedHitags);
        });  
    }

    updateHitagSuggestions(hitagSuggestions)
    {
        this.setState({hitagSuggestions: hitagSuggestions});
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
        if(this.state.selectedIndex< this.state.hitags.length-1)
            this.selectItem(this.state.selectedIndex + 1)
    }

    onNewTag(newTag)
    {
        var currentHitag = this.state.inputHitag;
        currentHitag.push(newTag);
        this.setState({
            inputHitag : currentHitag
        });

        this.checkIfDisplayAutocomplete(event.target.value, true);
    }

    onTagInputChanged(inputTag)
    {
        var inProgressHitag={
            hitag:this.state.inputHitag,
            inProgressHitag:inputTag
        }

        this.props.connector.sendMessage("getSuggestedHitags", inProgressHitag); 
    }

    onEnter(newTag)
    {
        var currentHitag = this.state.inputHitag;
        if(newTag!="")
            currentHitag.push(newTag);

        var hitags = this.state.hitags;
        if(currentHitag.length > 0)
            hitags.push(currentHitag);

        this.props.connector.sendMessage("setHitagToContent", currentHitag);

        this.setState({
            hitags: hitags,
            inputHitag: []
        });

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
            inputHitag: this.state.hitags[index],
        })
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
        var style ={
            display: 'flex',
            flexWrap:'nowrap',
            flexDirection:'row'
        };

        var children = [];

        this.state.hitags.map(function(item, index)
        {
            children.push(<Hitag hitag={item}/>);
        });

        return(
            <HotKeys  style = {{outline:'none'}} handlers = {this.hotKeyshandlers} >
                <Hitag inProgress={true}
                    onNewTag={this.onNewTag.bind(this)}
                    onEnter = {this.onEnter}
                    onNewTagChanged = {this.onTagInputChanged}
                    style={{flex:1}}
                    encapsulated = {false}
                    hitag ={this.state.inputHitag}/>
                <SelectableList asList= {true} children = {children} encapsulated = {false} selectedIndex = {this.state.selectedIndex} onItemSelected = {this.onListItemSelected}/> 
            </HotKeys>             
        ); 
    }
}