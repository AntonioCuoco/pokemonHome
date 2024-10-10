import { FullscreenOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import imgLogo from '../../assets/logo.png'
import { useSelector } from 'react-redux';
import { isNil, isNilAndLengthPlusZero, isNilAndLengthPlusZeroArray, isNilOnly, isNotNil, isNotNilOnly } from '../../utils/utils';
import { useEffect, useState } from 'react';
import { Button, Modal, AutoComplete, Input, Dropdown, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import DropdownCustom from '../../components/dropdown/DropdownCustom';
import axios from 'axios';
import "./dashboard.css"

const Dashboard = () => {
    const photoUrl = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('photoUrl') : useSelector((state) => state.auth.photoUrl);
    const name = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('name') : useSelector((state) => state.auth.name);
    const email = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('email') : useSelector((state) => state.auth.email);
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [blog, setBlog] = useState([]);
    const [tournament, setTournament] = useState([]);

    useEffect(() => {
        (async function () {
            getArticle();
            handleRetrieveTournamentByDate();
        })();
    }, [])

    const getArticle = async () => {
        const article = await axios.get('http://localhost:8080/cms/getArticle');
        setBlog(article.data);
    }

    const handleRetrieveTournamentByDate = async () => {
        const tournament = await axios.get('http://localhost:3000/retrieveTournamentByDate');
        setTournament(tournament.data);
    }

    return (
        <div className='wrapper-dashboard'>
            <div className="wrapper-menù">
                <img src={imgLogo} className='img-logo' />
                <div className='wrapper-ul'>
                    <ul className='ul-menù'>
                        <li className='li-items'>Home</li>
                        <li className='li-items' onClick={() => { navigate("/pokedex") }}>Pokedex</li>
                        <li className='li-items' onClick={() => { navigate("/chat") }}>Chat</li>
                    </ul>
                </div>
                {/* <img src={imgLogo} className='img-profile-pic' /> */}
                {isNil(photoUrl) ? <div className='img-profile-pic' onClick={() => setOpenDropdown((prev) => prev = !prev)}></div> : <img src={photoUrl} className='img-profile-pic' onClick={() => setOpenDropdown((prev) => prev = !prev)} />}
                {openDropdown && <DropdownCustom />}
            </div>
            <div className='body-wrapper'>
                <div className='sider-wrapper'>
                    <div className='article-wrapper'>
                        <h1 className='paragraph-style'>ARTICLE</h1>
                        <div className='wrapper-article'>
                            {blog.map(((ithArticle) => (
                                <div className='wrapper-article'>
                                    <img src={ithArticle.imgCopertina} className='img-article-blog' />
                                    <div>
                                        <h1 className='paragraph-style'>{ithArticle.titleArticle}</h1>
                                        <p className='paragraph-style'>{ithArticle.subTitle}</p>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </div>
                    <div className='OncomingTournament-wrapper'>
                        <h1 className='paragraph-style'>ON COMING TOURNAMENT</h1>
                        <div className='wrapper-tournament-element'>
                            {tournament.map((ithTournament) => (
                                <div>
                                    <p className='paragraph-style'>{ithTournament.name}</p>
                                    <p className='paragraph-style'>{ithTournament.dataInizio} to {ithTournament.dataFine}</p>
                                    <Button><a href={"https://victoryroadvgc.com/2025-season-calendar/"}>Info</a></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <p className="paragraph-style">creare parte apposto di articoli che prende tutti i pokemon giocati nei tornei e ne fa una percentuale di utilizzo e vede i più giocati</p>
        </div>
    )
}

export default Dashboard;