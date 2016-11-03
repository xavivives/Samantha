import React from 'react';
import LazyLoad from 'react-lazy-load';
import Metaget from 'metaget';
import DomainUtil from 'tldjs';
import Atom from './../atom.js';

export default class searchResultItem extends React.Component
{
    constructor(props)
    {
        super(props);

        this.atom = new Atom();
        this.atom.populate(props.result.atom);

        this.onClicked = this.onClicked.bind(this);

        this.url = this.atom.getContentData();
        this.urlDomain = DomainUtil.getDomain(this.url);      
        this.subdomain = DomainUtil.getSubdomain(this.url);
        this.fullDomain = this.urlDomain;

        if(this.subdomain)
          this.fullDomain = this.subdomain + "." + this.urlDomain;

        var domainStartIndex = this.url.indexOf(this.fullDomain);
        var domainFinishIndex = domainStartIndex + this.fullDomain.length;

        this.beginingOfUrl = this.url.substr(0,domainStartIndex);
        this.endOfUrl = this.url.substr(domainFinishIndex);

        this.state= {
            imageUrl: null,
            imageHeight:50,
            imageWidth:0
        };

        var that = this;

        setTimeout(function(){ that.fetchMetadata(that.url) }, 200);    
    }

    componentWillMount()
    {
        this.resultStillActive = true;
    }

    componentWillUnmount()
    {
        this.resultStillActive = false;
    }

    fetchMetadata(url)
    {
        if(!url)
            return;

        var that = this;

        if(!that.resultStillActive)
            return;
        
        Metaget.fetch(url, function(error, metadata)
        {
            if(!that.resultStillActive)
                return;

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
      //this.setState({open: true});
      this.gotoUrl(this.url);
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
                        {this.atom.getName()}
                    </p>
                    <p style = {{opacity:0.6, marginBottom:"0.5em", marginTop:0}}> 

                        <span style = {{color: 'green'}}>
                            {Math.round(this.props.result.score*100)/100+ " "}
                        </span>
                      
                         <span style = {{opacity:0.6}}>
                           {this.beginingOfUrl}
                        </span>
                        <span style = {{opacity:0.8, fontWeight:"bold"}}>
                           {this.fullDomain}
                        </span> 
                        <span style = {{opacity:0.6}}>
                           {this.endOfUrl}
                        </span>                                

                    </p> 
                </div>
                <LazyLoad height={this.imageHeight} offset={300}>
                    <img style={{objectFit: 'cover', WebkitBorderRadius: 3}}width = {this.state.imageWidth} height = {this.state.imageHeight} src={this.state.imageUrl} />
                </LazyLoad>
            </div>
        );
    }
}