import ReactDOM from 'react-dom';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

export default class DomUtils
{
    static  getElementRect(that, ref)
    {
        var element = ReactDOM.findDOMNode(that.refs[ref]);
        var rects = element.getClientRects();
        return rects[0];
    }

    static inject(reactElement, props, elementToFindId, onRendered)
    {
        injectTapEventPlugin();

        var elementFound = {};
        if(elementToFindId)
            elementFound = document.getElementById(elementToFindId);
        else
            elementFound = document.body;

        var firstResult = elementFound.children[0];
        var container = document.createElement('div');

        elementFound.insertBefore(container,firstResult);

        var reactElement = React.createElement(reactElement, props);

        ReactDOM.render(reactElement, container, onRendered);
    }

}
        