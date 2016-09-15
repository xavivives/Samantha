import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import LazyLoad from 'react-lazy-load';
import Metaget from 'metaget';
import DomainUtil from 'tldjs';

export default class searchResultItem extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onClicked = this.onClicked.bind(this);
        this.urlDomain = DomainUtil.getDomain(props.result.url);

        var subdomain = DomainUtil.getSubdomain(props.result.url);
        if(subdomain)
          this.urlDomain=subdomain+"."+this.urlDomain;

        this.state= {
              imageUrl: null,
              imageHeight:50,
              imageWidth:0
          };

        var that = this;

        Metaget.fetch(props.result.url, function(error, metadata)
        {
            if(error)
            {
                console.log("Fetching metadata error: "+ error);
            }
            else
            {
                that.processMetadata(metadata)
            }

        });
    }

    processMetadata(metadata)
    {
        console.log(metadata);
        var imageUrl = this.getImageUrl(metadata);
        if(imageUrl)
        {   
            this.setState({imageUrl: imageUrl, imageWidth:1.62 * this.state.imageHeight});
        }
        else
        {
            this.setState({imageWidth: 0 });
        } 
    }

    getImageUrl(metadata)
    {
        if(metadata["og:image"])
            return metadata["og:image"];
        else if(metadata["twitter:image"])
            return metadata["twitter:image"]; 
        return null;
    }

    onClicked(result)
    {
      this.setState({open: true});
      this.gotoUrl(result.url);
    }

    gotoUrl(url)
    {
      window.location.href = url;
    }

    render() {
        return (
            <div onClick= {()=>this.onClicked(this.props.result)}  style={{cursor: 'pointer', display: 'flex', paddingBottom:5}}>

                <div style={{flexGrow: 1, paddingRight:10}}>

                    <p style = {{opacity:0.9, marginBottom:"0.5em", marginTop:0}}> 
                        {this.props.result.content}
                    </p>
                    <p style = {{opacity:0.6, marginBottom:"0.5em", marginTop:0}}> 

                        <span style = {{color: 'green'}}>
                            {Math.round(this.props.result.score*100)/100+ " "}
                        </span>

                        {this.urlDomain}

                    </p> 
                </div>
                <LazyLoad height={this.imageHeight} offset={300}>
                    <img style={{objectFit: 'cover', WebkitBorderRadius: 3}}width = {this.state.imageWidth} height = {this.state.imageHeight} src={this.state.imageUrl} />
                </LazyLoad>
            </div>
        );
    }
}