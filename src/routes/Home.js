import React from 'react';
import './Home.css'

class Home extends React.Component {
    render() {
        return (
            <section className="container">
                <h1>투자 지표 생성기 입니다</h1><br/>
                <p>
                    <a href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf" target="_blank">크롬 확장 도구</a> 등을 이용해서 CORS를 허용한 후에 사용 가능합니다.
                </p>
            </section>
        );
    }
}

export default Home;