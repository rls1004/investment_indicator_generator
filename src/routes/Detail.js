import React from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import './Detail.css'


class Detail extends React.Component {
    state = {
        isDone: false,
        investment: {}
    }
    getFullKeyRatio = async (link, ticker) => {
        if(this.state.isDone == true) return;
        const datas = await axios.get(link);
        const id = datas.data.split('byId:{"')[1].split('"')[0];
        const getFinancePartURL = "https://financials.morningstar.com/finan/financials/getFinancePart.html?t="+id;
        const getKeyPartURL = "https://financials.morningstar.com/finan/financials/getKeyStatPart.html?t="+id;

        const financePart = (await axios.get(getFinancePartURL)).data.componentData;
        let $ = cheerio.load(financePart);

        let inv = {};

        let oi = [];
        let cur = $("#i2").get(0);
        for(let i=0; i<11; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            if (i>4) oi.push(tmp);
        }

        let om = [];
        cur = $("#i3").get(0);
        for(let i=0; i<11; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            if (i>4) om.push(tmp);
        }
        let eps = [];
        cur = $("#i5").get(0);
        for(let i=0; i<11; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            if (i>4) eps.push(tmp);
        }

        let fcfps = [];
        cur = $("#i90").get(0);
        for(let i=0; i<11; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            if (i>4) fcfps.push(tmp);
        }

        let shares = [];
        cur = $("#i7").get(0);
        for(let i=0; i<11; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            if (i>4) shares.push(tmp);
        }

        let dividends = [];
        cur = $("#i6").get(0);
        for(let i=0; i<11; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            if (i>4) dividends.push(tmp);
        }

        let years = [];
        cur = $("tr").get(0).children[5];
        for(let i=0; i<6; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            years.push(tmp);
        }

        const keyPart = await (await axios.get(getKeyPartURL)).data.componentData;
        $ = cheerio.load(keyPart);
        let roe = [];
        cur = $("#i26").get(0);
        for(let i=0; i<6; i++) {
            let tmp = cur.next.children[0].data;
            cur = cur.next;
            roe.push(tmp);
        }

        const guruURL = "https://www.gurufocus.com/stock/"+ticker+"/summary";
        const datas2 = (await axios.get(guruURL)).data;
        $ = cheerio.load(datas2);
        let per = [];
        try {
            let peRatioURL = "https://www.gurufocus.com";
            peRatioURL += $(".stock-indicator-table")[2].childNodes[2].children[0].children[0].children[0].attribs.href;

            const datas3 = (await axios.get(peRatioURL)).data;
            $ = cheerio.load(datas3);
            cur = $(".R10").get(0).children[3].children[2].children[11];
            for(let i=0; i<5; i++) {
                let tmp = cur.next.next.children[0].data;
                cur = cur.next.next;
                per.push(tmp);
            }
        } catch (e) {
            per = ['—','—','—','—','—','-'];
        }

        inv['oi'] = oi;
        inv['om'] = om;
        inv['eps'] = eps;
        inv['fcfps'] = fcfps;
        inv['years'] = years;
        inv['shares'] = shares;
        inv['roe'] = roe;
        inv['dividends'] = dividends;
        inv['per'] = per;

        this.setState({investment: inv, isDone: true})
    }
    render() {
        const { location } = this.props;
        const {isDone, investment} = this.state;
        if (location.state) {
            this.getFullKeyRatio(location.state.link, location.state.ticker);
            return (
                <div>
                    <div>
                        <h3>{location.state.name}</h3>
                        <p>{location.state.exch} | {location.state.ticker}</p>
                    </div>
                    {isDone? (
                        <table>
                            <thead>
                            <tr>
                                <th></th>
                                {investment.years.map((val) => (
                                    (<th>{val}</th>)
                                ))}
                            </tr>
                            </thead>
                            <tr>
                                <th>영업 이익</th>
                                {investment.oi.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>영업 이익률</th>
                                {investment.om.map((val) => (
                                    (<td>{val}%</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>EPS</th>
                                {investment.eps.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>Free Cash Flow Per Share</th>
                                {investment.fcfps.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>주식 수</th>
                                {investment.shares.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>ROE</th>
                                {investment.roe.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>배당금</th>
                                {investment.dividends.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                            <tr>
                                <th>PER</th>
                                {investment.per.map((val) => (
                                    (<td>{val}</td>)
                                ))}
                            </tr>
                        </table>
                    ):(
                        <div>Loading...</div>
                    )}
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Detail;