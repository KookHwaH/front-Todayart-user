import React, { Component } from 'react';
import '../../common/index.scss';
import Slider from 'react-slick';
import './main.css'
// Import custom components
import SpecialProducts from "./special-products"
import BlogSection from "../common/blogsection"
import ThemeSettings from "../../common/theme-settings"
import {Helmet} from 'react-helmet'

class Todayart extends Component {

    componentDidMount() {
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/color19.css` );
    }

    render(){
        return (
            <div>
                <Helmet>
                    <title>TodayArt | 오늘의 아트</title>
                    <meta name="description" content="TodayArt - 아마추어 미술인과 수요자들을 연결시켜주는 미술품 판매사이트" />
                </Helmet>
                <section className="p-0 small-slider">
                    <Slider className="slide-1 home-slider" autoplay infinite>
                        <div>
                            <div className="home home12 text-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div className="text-focus-in">
                                                    <h4 className="ta-sub">today art</h4>
                                                    <h1 className="ta-main">Art Gallery Shop</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home13 text-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div className="text-focus-in">
                                                    <h4 className="ta-sub">today art</h4>
                                                    <h1 className="ta-main">Art Gallery Shop</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home14 text-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div className="text-focus-in">
                                                    <h4 className="ta-sub">today art</h4>
                                                    <h1 className="ta-main">Art Gallery Shop</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="home home15 text-left">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <div className="slider-contain">
                                                <div className="text-focus-in">
                                                    <h4 className="ta-sub">today art</h4>
                                                    <h1 className="ta-main">Art Gallery Shop</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </section>

                {/*Special Products Start*/}
                <SpecialProducts type={'todayart'} />
                {/*Special Products End*/}

                {/*Parallax banner*/}
                <section className="p-0">
                    <div className="full-banner parallax parallax-banner3 text-center p-center">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="banner-contain">
                                        <h2>2019.10.26</h2>
                                        <h3>TodayArt Season 2</h3>
                                        <h4>COMING SOON!!!</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/*Parallax banner end*/}


                {/* Blog Section Section*/}
                <section className="blog blog-2 section-b-space ratio3_2">
                    <div className="container ">
                        <div className="row">
                            <div className="col">
                                <div className="title1">
                                    <h4>Recent Story</h4>
                                    <h2 className="title-inner1">from the Exhibition</h2>
                                    <div className="tabs tab-title">
                                        <h4>Exhibition Information</h4></div>
                                    <hr role="tournament6" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <BlogSection />
                </section>
                {/* Blog Section End*/}
            </div>
        )
    }
}


export default Todayart;