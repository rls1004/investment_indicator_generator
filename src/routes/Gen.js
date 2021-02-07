import React, { useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import Card from '../components/Card';
import './Gen.css';

const useInput = (placeValue) => {
    const [value, setValue] = useState();
    const onChange = event => {
        const {
            target: {value}
        } = event;
        setValue(value);
    }
    return { props: {value, onChange}, utils: {setValue} };
}

class Gen extends React.Component {
    state = {
        doSearch: 0,
        ticker: {},
    };
    setTicker = async (e) => {
        await this.setState({ticker: e.target.value});
    }
    getTickers = async () => {
        const datas = await axios.get("https://www.morningstar.com/search?query="+this.state.ticker);
        let $ = cheerio.load(datas.data);
        let us_result = $(".mdc-security-module");
        let search_result = us_result.get(0);
        let search_ticker = {};
        search_ticker['name'] = search_result.children[0].children[0].data;
        search_ticker['link'] = "https://www.morningstar.com";
        search_ticker['link'] += search_result.children[0].attribs.href;
        search_ticker['exch'] = search_result.children[2].children[0].children[0].data;
        search_ticker['ticker'] = search_result.children[2].children[2].children[0].data;
        this.setState({ticker: search_ticker, doSearch: 1});
    }
    render() {
        const {doSearch, ticker} = this.state;
        const submit = (e) => {
            if (e.charCode == 13) this.getTickers();
        }
        return (
            <section>
                <h1>Gen</h1>
                <div className="searchBar">
                <span className="icon"><i className="fa fa-search"></i></span>
                <input placeholder="Ticker..." onChange={this.setTicker} onKeyPress={submit}></input>
                </div>
                {doSearch == 1? (
                        <div>
                            <Card
                                name={ticker.name}
                                link={ticker.link}
                                exch={ticker.exch}
                                ticker={ticker.ticker}
                            />
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </section>
        );
    }
}

export default Gen;