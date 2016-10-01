import React from 'react';
import TextField from 'material-ui/TextField';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';
import HitagUtils from './hitagUtils.js';

export default class PopupPage extends React.Component
{
    static get defaultProps()
    {
        var props = 
        {
           isOpened :true
        }

        return props;
    }

    constructor(props)
    {
        super(props);

        this.onNewTag = this.onNewTag.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onTagInputFocus = this.onTagInputFocus.bind(this);
        this.onTagInputBlur = this.onTagInputBlur.bind(this);
        this.checkIfDisplayAutocomplete = this.checkIfDisplayAutocomplete.bind(this);

        this.onListItemSelected = this.onListItemSelected.bind(this);
        this.selectItem = this.selectItem.bind(this);

        this.onAction = this.onAction.bind(this);
        this.onMoveUp = this.onMoveUp.bind(this);
        this.onMoveDown = this.onMoveDown.bind(this);

        this.state = {
            items:[], 
            selectedIndex:0,
            inputHitag:[]
        };

        this.hotKeyshandlers = {
          'action': this.onAction,
          'moveUp': this.onMoveUp,
          'moveDown':this.onMoveDown,
          'moveLeft': this.onMoveUp,
          'moveRight':this.onMoveDown,
        };
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
        if(this.state.selectedIndex< this.state.items.length-1)
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

    onEnter(newTag)
    {
        var currentHitag = this.state.inputHitag;
        if(newTag!="")
            currentHitag.push(newTag);

        var items = this.state.items;
        if(currentHitag.length > 0)
            items.push(currentHitag);

        this.setState({
            items: items,
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
            inputHitag: this.state.items[index],
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

        var children = []

        this.state.items.map(function(item, index)
        {
            children.push(<Hitag hitagChildren={item}/>);
        });

        return(
            <HotKeys  style = {{outline:'none'}} handlers = {this.hotKeyshandlers} >
                <Hitag inProgress={true} onNewTag={this.onNewTag.bind(this)} onEnter = {this.onEnter} style={{flex:1}} encapsulated = {false} hitagChildren ={this.state.inputHitag}/>
                <SelectableList asList= {true} children = {children} encapsulated = {false} selectedIndex = {this.state.selectedIndex} onItemSelected = {this.onListItemSelected}/> 
            </HotKeys>             
        ); 
    }
}
//