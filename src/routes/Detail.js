import React from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import './Detail.css'


class Detail extends React.Component {
    state = {
        isDone: false,
        investment: {}
    }

    getDataFromFinancePart = ($, searchClass) => {
        let result = [];
        let cur = $(searchClass).get(0).next.next.next.next.next.next;
        for(let i=0; i<6; i++) {
            let tmp = cur.children[0].data;
            cur = cur.next;
            result.push(tmp);
        }
        return result;
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

        let oi = this.getDataFromFinancePart($, "#i2");
        let om = this.getDataFromFinancePart($, "#i3");
        let eps = this.getDataFromFinancePart($, "#i5");
        let fcfps = this.getDataFromFinancePart($, "#i90");
        let shares = this.getDataFromFinancePart($, "#i7");
        let dividends = this.getDataFromFinancePart($, "#i6");

        let years = [];
        let cur = $("tr").get(0).children[5];
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
            per.push('—');
        } catch (e) {
            per = ['—','—','—','—','—','—'];
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
                                        (<th key={val}>{val}</th>)
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>영업 이익</th>
                                    {investment.oi.map((val, i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>영업 이익률</th>
                                    {investment.om.map((val, i) => (
                                        (<td key={i}>{val}%</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>EPS</th>
                                    {investment.eps.map((val,  i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>Free Cash Flow Per Share</th>
                                    {investment.fcfps.map((val, i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>주식 수</th>
                                    {investment.shares.map((val, i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>ROE</th>
                                    {investment.roe.map((val, i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>배당금</th>
                                    {investment.dividends.map((val, i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                                <tr>
                                    <th>PER</th>
                                    {investment.per.map((val, i) => (
                                        (<td key={i}>{val}</td>)
                                    ))}
                                </tr>
                            </tbody>
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