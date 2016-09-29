import React from 'react';
import TextField from 'material-ui/TextField';
import SelectableList from './selectableList.js';
import Hitag from './hitag.js';
import {HotKeys, HotKeyMapMixin} from 'react-hotkeys';


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

        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onTagInputKeyDown = this.onTagInputKeyDown.bind(this);
        this.onTagInputFocus = this.onTagInputFocus.bind(this);
        this.onTagInputBlur = this.onTagInputBlur.bind(this);
        this.checkIfDisplayAutocomplete = this.checkIfDisplayAutocomplete.bind(this);
        
        this.onTagInputChanged = this.onTagInputChanged.bind(this);
        this.onListItemSelected = this.onListItemSelected.bind(this);
        this.selectItem = this.selectItem.bind(this);

        this.onAction = this.onAction.bind(this);
        this.onMoveUp = this.onMoveUp.bind(this);
        this.onMoveDown = this.onMoveDown.bind(this);

        this.state = {
            tagInput:"",
            items:[], 
            selectedIndex:0
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

    onTagInputChanged(event)
    {
        this.setState({
            tagInput: event.target.value,
        });

        this.checkIfDisplayAutocomplete(event.target.value, true);
    }

    onTagInputKeyDown(event)
    {
        if(event.keyCode==13)
        {
            var newHitag = event.target.value;
            var items = this.state.items;
            items.push([newHitag,"hello", "potato"]);

            this.setState({
                items: items,
                tagInput: "",
            });

            this.checkIfDisplayAutocomplete("", true);
        }
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
        selectItem(index);
    }

    selectItem(index)
    {
        this.setState({
            selectedIndex:index,
            tagInput: this.state.items[index][0]
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
        return(
            <HotKeys  style = {{outline:'none'}} handlers = {this.hotKeyshandlers} >
                <div ref="tagInputContainer">
                    <TextField
                        hintText="Add tags..."
                        onChange={this.onTagInputChanged}
                        onKeyDown = {this.onTagInputKeyDown}
                        fullWidth={true}
                        value = {this.state.tagInput}
                        onFocus = {this.onTagInputFocus}
                        onBlur = {this.onTagInputBlur}/>
                </div>

                <SelectableList asList= {true} children = {this.state.items} encapsulated = {false} selectedIndex = {this.state.selectedIndex} onItemSelected = {this.onListItemSelected}/> 
            </HotKeys>             
        ); 
    }
}
//