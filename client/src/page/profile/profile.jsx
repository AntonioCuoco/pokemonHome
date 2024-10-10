import React, { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AutoComplete, Button, Input, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPhotoUrl, setLoggedIn } from '../../redux/slice/authSlice';
import { isNil, isNilOnly } from '../../utils/utils'
import ShowTeam from '../../components/viewTeam/viewTeam';
import './profile.css'

const Profile = () => {

    const actualEmail = isNil(useSelector((state) => state.auth.email)) ? sessionStorage.getItem('email') : useSelector((state) => state.auth.email);
    const photoUrl = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('photoUrl') : useSelector((state) => state.auth.photoUrl);
    const name = isNil(useSelector((state) => state.auth.name)) ? sessionStorage.getItem('name') : useSelector((state) => state.auth.name);
    const [actualUser, setActualUser] = useState({});
    const [imagePic, setImagePic] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false);
    const [isTournamentInfoOpen, setIsTournamentInfoOpen] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDifferent, setIsDifferent] = useState(false);
    const [team, setTeam] = useState([]);
    const [isShown, setIsShown] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [pastTournament, setPastTournament] = useState([]);
    const [options, setOptions] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            getActualUser();
            getTeamOfUser();
            getPastTournament();
        })(); // Qui viene invocata immediatamente la funzione
    }, [refetch]);

    const getTeamOfUser = async () => {
        const team = await axios.post('http://localhost:3000/getPokemonTeam', { nameUser: actualEmail });
        setTeam(team.data);
    }

    const handleSingleImageChange = (e) => {
        const imagePromises = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
                if (event.target.result != undefined || event.target.result != null) {
                    setImagePic(event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        });

        return imagePromises;

        // Promise.all(imagePromises).then((imageData) => {
        //   setImgCopertina([...imgCopertina, ...imageData]);
        // });
    };

    const handleOk = () => {
        updateImageProfile();
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    }

    const handleOk2 = () => {
        if (newPassword !== confirmPassword) {
            return setIsDifferent(true);
        }

        axios.post('http://localhost:3000/changePassword', { actualPassword: password, newPassword: newPassword, email: actualEmail })
    }

    const handleLogOut = () => {
        dispatch(setLoggedIn(false));
        sessionStorage.removeItem('authenticationKey');
        setRefetch(true);
        navigate('/');
    }

    const handleCancel2 = () => {
        setIsModalChangePasswordOpen(false);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const getActualUser = async () => {
        const user = await axios.post('http://localhost:3000/getActualUser', { email: actualEmail });
        setActualUser(user.data[0]);
    }

    const updateImageProfile = async () => {
        const userUpdated = await axios.post('http://localhost:3000/updateImagePic', { photoUrl: imagePic, email: actualEmail });
        setActualUser(userUpdated.data);
        if (!isNil(user.data[0].photoUrl)) {
            dispatch(setPhotoUrl(userUpdated.data.photoUrl));
            sessionStorage.setItem('photoUrl', userUpdated.data.photoUrl);
        }
        //settare nello stato globale photoUrl
        setRefetch((prev) => prev = !prev);
    }

    const getPastTournament = async () => {
        const tournament = await axios.get('http://localhost:3000/retrieveTournament');
        setPastTournament(tournament.data);
    }

    const handleImportTournamentInfo = () => {

        setIsTournamentInfoOpen(false);
    }

    const handleCancelTournamentModal = () => {
        setIsTournamentInfoOpen(false);
    }

    const handleTournamentSearch = (value) => {
        setOptions(
            value
                ? pastTournament.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                : []
        );
    };

    const handleTournamentSelect = (value) => {
        console.log(value);
    }

    return (
        <div className="wrapper-profile">
            <Modal title="Importa Info Torneo" open={isTournamentInfoOpen} onOk={() => handleImportTournamentInfo()} onCancel={() => handleCancelTournamentModal()}>
                <AutoComplete
                    onSearch={(value) => handleTournamentSearch(value)}
                    onSelect={(value) => handleTournamentSelect(value)}
                    placeholder="Cerca torneo"
                    style={{ width: '100%' }}
                >
                    {options.map((option, index) => (
                        <Option key={index} value={option}>
                            {option.name}
                        </Option>
                    ))}
                </AutoComplete>
            </Modal>
            <Modal title="Seleziona Un'immagine profilo" open={isModalOpen} onOk={() => handleOk()} onCancel={() => handleCancel()}>
                <Input type='file' accept="image/*" onChange={(e) => handleSingleImageChange(e)} />
            </Modal>
            <Modal title="Cambia Password" open={isModalChangePasswordOpen} onOk={() => handleOk2()} onCancel={() => handleCancel2()}>
                <label>Password Attuale:</label>
                <Input type='password' onChange={(e) => handlePassword(e)} value={password} />
                <label>Password Nuova:</label>
                <Input type='password' onChange={(e) => handleNewPassword(e)} value={newPassword} />
                <label>Conferma Password Nuova:</label>
                <Input type='password' onChange={(e) => handleConfirmPassword(e)} value={confirmPassword} />
                {isDifferent && <p style={{ color: 'red' }}>Le Due Password Non Corrispondono</p>}
            </Modal>
            <div className="first-div">
                <div className="wrapper-image">
                    <img className="img-profile" src={photoUrl} />
                </div>
                <p className='paragraph-style'>Name: {name}</p>
                <p className='paragraph-style'>Surname: Cuoco</p>
                <p className='paragraph-style'>Email: {actualEmail}</p>

                <Button className='btn-profile' onClick={() => setIsTournamentInfoOpen(true)}>Import Tournament Info</Button>
                <Button className='btn-profile' onClick={() => setIsModalOpen(true)}>Imposta Foto Profilo</Button>
                <Button className='btn-profile' onClick={() => setIsModalChangePasswordOpen(true)}>Change Password</Button>
                {/* <Button className='btn-profile' onClick={() => handleDeleteAccount()}>Delete Account</Button> */}
                <Button className='btn-profile' onClick={() => handleLogOut()}>Log Out</Button>
                <Button className='btn-profile' onClick={() => navigate('/')}>Go Back</Button>
            </div>
            <div className="second-div">
                <div>
                    {/* <div className='menù-show-team'>
                        <h1 className='paragraph-style'>Ultimi Team Creati</h1>
                        <div className='menù-show-team'>
                            {isShown ? <Input onChange={(e) => handleChangeSearch(e)} /> : null}
                            <SearchOutlined onClick={() => handleOnClickSearch()} style={{ marginLeft: 12 }} />
                        </div>
                    </div> */}
                    {/* {team.slice(0, 5).map((ithTeam) => (
                        <div className='wrapper-team-profile'>
                            {ithTeam.teamArray.map((ithTeam) => (
                                <div className='subwrapper-team-profile'>
                                    <img src={ithTeam.sprites} className='img-pokemon-team' />
                                    <img src={ithTeam.heldItem.sprites.default} className='img-held-item' />
                                </div>
                            ))}
                        </div>
                    ))} */}
                    <ShowTeam />
                    <div className='wrapper-square-profile'>
                        <div className='wrapper-square'>
                            <div className='first-square'>
                                <h1 className='paragraph-style'>N.tornei giocati in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='second-square'>
                                <h1 className='paragraph-style'>N.tornei vinti in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='third-square'>
                                <h1 className='paragraph-style'>N.day 2 giocati in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='fourth-square'>
                                <h1 className='paragraph-style'>N.top 64 fatti in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='fifth-square'>
                                <h1 className='paragraph-style'>N.128 giocate in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='sixth-square'>
                                <h1 className='paragraph-style'>N.league challenge giocate in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='sixth-square'>
                                <h1 className='paragraph-style'>N.league challenge vinte in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='seventh-square'>
                                <h1 className='paragraph-style'>N.league cup giocate in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                            <div className='eighth-square'>
                                <h1 className='paragraph-style'>N.league cup vinte in stagione:</h1>
                                <p className='paragraph-style'>1</p>
                            </div>
                        </div>
                        <Button>Cerca torneo</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;