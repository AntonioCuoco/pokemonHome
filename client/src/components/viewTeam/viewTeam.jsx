import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isNil, isNilAndLengthPlusZero, isNilAndLengthPlusZeroArray, isNilOnly, isNotNil, isNotNilOnly } from '../../utils/utils';
import { useEffect, useState } from 'react';
import { Button, Modal, AutoComplete, Input, Dropdown, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import "./ShowTeam.css";

const ViewTeam = () => {
    const { Option } = AutoComplete;
    const [formEvs] = useForm();
    const photoUrl = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('photoUrl') : useSelector((state) => state.auth.photoUrl);
    const name = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('name') : useSelector((state) => state.auth.name);
    const email = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('email') : useSelector((state) => state.auth.email);
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [IsHeldItemOpen, setIsHeldItemOpen] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [pokemonData, setPokemonData] = useState([]);
    const [limit, setLimit] = useState(100000);
    const [offset, setOffset] = useState(0);
    const [options, setOptions] = useState([]);
    const [optionsMosse, setOptionsMosse] = useState([]);
    const [datiPredefiniti, setDatiPredefiniti] = useState([]);
    const [datiPredefinitiMosse, setDatiPredefinitiMosse] = useState([]);
    const [pokemonMoves, setPokemonMoves] = useState([]);
    const [pokemonMovesArray, setPokemonMovesArray] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [pokemonTeam, setPokemonTeam] = useState([]);
    const [namePokemonSelected, setNamePokemonSelected] = useState("");
    const [nameTeam, setNameTeam] = useState("");
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [isOpenTeamPreview, setIsOpenTeamPreview] = useState(false);
    const [pokemonIvs, setPokemonIvs] = useState([]);
    const [pokemonEvs, setPokemonEvs] = useState([]);
    const [valueSearchTeam, setValueSearchTeam] = useState("");
    const [team, setTeam] = useState([]);
    const [index, setIndex] = useState(0);
    const [heldItemInputValue, setHeldItemInputValue] = useState("");
    const [abilityValue, setAbilityValue] = useState("");
    const [natureValue, setNatureValue] = useState("");
    const [heldItem, setHeldItem] = useState();
    const [ability, setAbility] = useState();
    const [nature, setNature] = useState();
    const [isShown, setIsShown] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [refetch, setRefetch] = useState(1);

    const items = [
        {
            key: '1',
            label: (
                <p onClick={() => handleSetMove()}>settare ev's,iv's e mosse</p>
            ),
        },
        {
            key: '2',
            label: (
                <p onClick={() => handleRemovePokemon()}>elimina pokemon</p>
            ),
        },
        {
            key: '3',
            label: (
                <p onClick={() => handleOpenHeldItems()}>settare held item, nature and ability</p>
            ),
        },
    ];

    useEffect(() => {
        (async function () {
            getItem();
        })();
    }, [limit, offset])

    useEffect(() => {
        (async function () {
            getPokemonTeam();
        })();
    }, [refetch])

    const getPokemonTeam = async () => {
        const pokemonTeam = await axios.post('http://localhost:3000/getPokemonTeam', { nameUser: email });
        setPokemonTeam(pokemonTeam.data);
    }

    const handleSearch = (value) => {
        setOptions(
            value
                ? datiPredefiniti.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                : []
        );
    };

    const handleSelect = async (value) => {
        const pokemonSelectedData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${value}`);
        const pokemonTypes = [];

        pokemonSelectedData.data.types.map((ithType) => {
            pokemonTypes.push(ithType.type.name);
        });

        const pokemonObject = {
            name: value,
            // nameTeam: nameTeam,
            types: pokemonTypes,
            sprites: pokemonSelectedData.data.sprites.front_default,
            pokemonMoves: pokemonMoves,
            pokemonIVs: pokemonIvs,
            pokemonEVs: pokemonEvs
        };
        setSelectedValues(prevValues => [...prevValues, pokemonObject]);
    };

    const handleSearchMoves = (value) => {
        setOptionsMosse(
            value
                ? datiPredefinitiMosse.filter(item => item.toLowerCase().includes(value.toLowerCase()))
                : []
        );
    };

    const handleSelectMoves = async (value) => {
        setPokemonMoves(prevState => [...prevState, value]);
    };

    const handleNameTeam = async (e) => {
        setNameTeam(e.target.value);
    }

    const getItem = async () => {
        const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        setPokemonData(pokemonData.data.results);
        setDatiPredefiniti(pokemonData.data.results);
        //prendere i dati dal url dentro l'oggetto e stampare i tipi e lo sprite nella modale
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOkTeamPreview = () => {
        setIsOpenTeamPreview((prevState) => prevState = !prevState);
    }

    const handleCancelTeamPreview = () => {
        setIsOpenTeamPreview((prevState) => prevState = !prevState);
    }

    const handleOk = async () => {
        if (selectedValues.length > 6) {
            return alert('il team può essere formato massimo da 6 pokemon');
        }

        const response = await axios.post('http://localhost:3000/savePokemonTeam', { nameTeam: nameTeam, nameUser: email, selectedPokemon: selectedValues });
        setIsModalOpen(false);
        setSelectedValues([]);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOkMoves = () => {
        setPokemonMovesArray(prevState => [...prevState, {
            name: namePokemonSelected,
            pokemonMoves: pokemonMoves
        }
        ]);

        const selectedValueUpdated = selectedValues.map((ithSelected) => {
            if (ithSelected.name === namePokemonSelected) {
                return { ...ithSelected, pokemonMoves: pokemonMoves };
            }
            return ithSelected;
        })

        setSelectedValues(selectedValueUpdated);
        setDatiPredefinitiMosse([]);
        setPokemonMoves([]);
        setIsMoveOpen(false);
        setIsStatsOpen(true);
    };

    const handleOkHeldItems = async () => {

        const selectedValueUpdated = selectedValues.map((ithSelected) => {
            if (ithSelected.name === namePokemonSelected) {
                return {
                    ...ithSelected,
                    heldItem: heldItem,
                    nature: nature,
                    ability: ability
                };
            }
            return ithSelected;
        })

        setSelectedValues(selectedValueUpdated);
        setIsHeldItemOpen(false);
    };

    const handleCancelMoves = () => {
        setIsMoveOpen(false);
    };

    const handleCancelHeldItems = () => {
        setIsHeldItemOpen(false);
    };

    const handleOkStats = () => {
        setIsStatsOpen(false);
    };

    const handleCancelStats = () => {
        setIsStatsOpen(false);
    };

    const handleOpenModal = () => {
        getItem();
        setIsModalOpen(prevState => prevState = !prevState);
    }

    const handleOpenModalViewInformation = () => {
        setIsOpenTeamPreview(prevState => prevState = !prevState);
    }

    const handleAugmentLimit = () => {
        setSelectedValues([]);
    }

    const handleOpenMoveModal = async (e) => {
        setIsOpenDropdown(prevState => prevState = !prevState);
        setNamePokemonSelected(e.target.innerText.toLowerCase());
    }

    const handleSetMove = async () => {
        const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${namePokemonSelected}`);
        pokemonData.data.moves.map((ithMoves) => { setDatiPredefinitiMosse((prevState) => [...prevState, ithMoves.move.name]) });
        setIsMoveOpen(true);
        setIsOpenDropdown(false);
    }

    const handleRemovePokemon = () => {
        setSelectedValues(selectedValues.filter((ithSelected) => ithSelected.name !== namePokemonSelected));
        setIsOpenDropdown(false);
    }

    const handleOpenHeldItems = () => {
        setIsOpenDropdown(false);
        setIsHeldItemOpen(true);
    }

    const handleEvs = async (e) => {

        console.log(e);

        const hpIVs = e.HPivs;
        const attackIVs = e.ATTACKivs;
        const defenseIVs = e.DEFENSEivs;
        const specialAttackIVs = e.SPECIALATTACKivs;
        const specialDefenseIVs = e.SPECIALDEFENSEivs;
        const speedIVs = e.SPEEDivs;

        if (isNil(hpIVs) && isNil(attackIVs) && isNil(defenseIVs) && isNil(specialAttackIVs) && isNil(specialDefenseIVs) && isNil(speedIVs)) {
            return alert("inserisci i campi");
        }

        setPokemonIvs({
            hp: hpIVs,
            attack: attackIVs,
            defense: defenseIVs,
            specialAttack: specialAttackIVs,
            specialDefense: specialDefenseIVs,
            speed: speedIVs
        });

        const hpEVs = e.HPevs;
        const attackEVs = e.ATTACKevs;
        const defenseEVs = e.DEFENSEevs;
        const specialAttackEVs = e.SPECIALATTACKevs;
        const specialDefenseEVs = e.SPECIALDEFENSEevs;
        const speedEVs = e.SPEEDevs;

        if (isNil(hpEVs) && isNil(attackEVs) && isNil(defenseEVs) && isNil(specialAttackEVs) && isNil(specialDefenseEVs) && isNil(speedEVs)) {
            return alert("inserisci i campi");
        }

        setPokemonEvs({
            hp: hpEVs,
            attack: attackEVs,
            defense: defenseEVs,
            specialAttack: specialAttackEVs,
            specialDefense: specialDefenseEVs,
            speed: speedEVs
        });

        const selectedValueUpdated = selectedValues.map((ithSelected) => {
            if (ithSelected.name === namePokemonSelected) {
                return {
                    ...ithSelected,
                    pokemonEVs: pokemonEvs,
                    pokemonIVs: pokemonIvs
                };
            }
            return ithSelected;
        })

        setSelectedValues(selectedValueUpdated);
        formEvs.resetFields();
        setIsStatsOpen(false);
    };

    const handleTeamValue = (e) => {
        setValueSearchTeam(e.target.value);
    }

    const handleSearchTeam = async () => {
        const teamArray = await axios.post('http://localhost:3000/getTeamByTeamName', { searchValue: valueSearchTeam });
        setTeam(teamArray.data);
    }

    const handleAugmentIndex = () => {
        setIndex((prevState) => prevState = prevState + 1);
    }

    const handleOnChangeHeldItem = (e) => {
        setHeldItemInputValue(e.target.value);
    }

    const handleSearchHeldItem = async () => {
        const results = await axios.get(`https://pokeapi.co/api/v2/item/${heldItemInputValue}`);
        setHeldItem(results.data);
    }

    const handleSearchNature = async () => {
        const results = await axios.get(`https://pokeapi.co/api/v2/nature/${natureValue}`);
        setNature(results.data);
    }

    const handleSearchAbility = async () => {
        const results = await axios.get(`https://pokeapi.co/api/v2/ability/${abilityValue}`);
        setAbility(results.data);
    }

    const handleOnChangeAbility = (e) => {
        setAbilityValue(e.target.value);
    }

    const handleOnChangeNature = (e) => {
        setNatureValue(e.target.value);
    }

    const handleOnClickSearch = async () => {
        setIsShown((prevState) => prevState = !prevState);
        if (!isNil(searchValue)) {
            const getData = await axios.post('http://localhost:3000/getTeamByTeamName', { searchValue: searchValue });
            setPokemonTeam(getData.data);
        }
    }

    const handleChangeSearch = (e) => {
        setSearchValue(e.target.value);
    }

    const handleOnClickReload = () => {
        setRefetch((prevState) => prevState = prevState + 1);
    }

    const customFooter = (
        <div className='wrapper-btn-modal'>
            <div>
                <Button key="avanti" onClick={() => handleAugmentLimit()}>
                    Svuota Team
                </Button>
            </div>
            <div>
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button key="submit" type="primary" onClick={handleOk} style={{ marginLeft: 12 }}>
                    Ok
                </Button>
            </div>
        </div>
    );

    const customFooterMoves = (
        <div className='wrapper-btn-modal'>
            <div>
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button key="submit" type="primary" onClick={handleOkMoves} style={{ marginLeft: 12 }}>
                    Ok
                </Button>
            </div>
        </div>
    )

    const customFooterHeldItems = (
        <div className='wrapper-btn-modal'>
            <div>
                <Button key="back" onClick={handleCancelHeldItems}>
                    Cancel
                </Button>
                <Button key="submit" type="primary" onClick={handleOkHeldItems} style={{ marginLeft: 12 }}>
                    Ok
                </Button>
            </div>
        </div>
    )

    return (
        <div className='wrapper-dashboard'>
            <Modal title="Scegli strumento, abilita e natura" open={IsHeldItemOpen} onOk={handleOkHeldItems} onCancel={handleCancelHeldItems} footer={customFooterHeldItems} closable={false}>
                <div className='wrapper-held-items'>
                    <div>
                        <label>Scegli lo strumento:</label>
                        <div className='wrapper-input-held-item'>
                            <Input onChange={(e) => handleOnChangeHeldItem(e)} className='input-held-item' />
                            <SearchOutlined className='search-icon' onClick={() => handleSearchHeldItem()} />
                        </div>
                        {isNotNilOnly(heldItem) ? <img src={heldItem.sprites.default} style={{ width: 50 }} /> : null}
                        {isNotNilOnly(heldItem) ? <p>{heldItem.effect_entries[0].effect}</p> : null}
                    </div>
                    <div className='wrapper-ability-nature'>
                        <div className='wrapper-ability'>
                            <label>Scegli l'abilità:</label>
                            <div className='wrapper-input-held-item'>
                                <Input onChange={(e) => handleOnChangeAbility(e)} className='input-held-item' />
                                <SearchOutlined className='search-icon' onClick={() => handleSearchAbility()} />
                            </div>
                            {isNotNilOnly(ability) ? <p>{ability.effect_entries[1].effect}</p> : null}
                        </div>
                        <div className='wrapper-nature'>
                            <label>Scegli la natura:</label>
                            <div className='wrapper-input-held-item'>
                                <Input onChange={(e) => handleOnChangeNature(e)} className='input-held-item' />
                                <SearchOutlined className='search-icon' onClick={() => handleSearchNature()} />
                            </div>
                            {isNotNilOnly(nature) ? <p>+{nature.increased_stat.name}</p> : null}
                            {isNotNilOnly(nature) ? <p>-{nature.decreased_stat.name}</p> : null}
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal title="" open={isOpenTeamPreview} onOk={handleOkTeamPreview} onCancel={handleCancelTeamPreview} footer={false} closable={false}>
                <div className="subWrapper-dashboard">
                    <div className='search-item'>
                        <Input placeholder='Search a Team' onChange={(e) => handleTeamValue(e)} />
                        <SearchOutlined onClick={() => handleSearchTeam()} />
                    </div>
                    <div className='wrapper-img-pokemon'>
                        {/* {!isNilAndLengthPlusZeroArray(team) ? team.teamArray.map((ithPokemon) => {
                            return <img src={ithPokemon.sprites} className='pokemon-img-preview'/>
                        }) : null} */}
                        {!isNilAndLengthPlusZeroArray(team) ?
                            <div>
                                <div className='wrapper-pokemon-preview'>
                                    <div className='wrapper-imgPokemon-info'>
                                        <img src={team[0].teamArray[index].sprites} />
                                        <div>
                                            <h1 style={{ textTransform: 'uppercase' }}>{team[0].teamArray[index].name}</h1>
                                            <div className='wrapper-types'>
                                                {!isNilAndLengthPlusZeroArray(team[0].teamArray[index].types) ? team[0].teamArray[index].types.map((ithTypes) => {
                                                    return <p className='type-paragraph'>{ithTypes}</p>
                                                }) : null}
                                            </div>
                                            <p>ABILITY: {team[0].teamArray[index].ability.name}</p>
                                            <p>NATURE: {team[0].teamArray[index].nature.name}</p>
                                            <div className='wrapper-held-item-team-preview'>
                                                <p>HELD ITEM:</p>
                                                <img src={team[0].teamArray[index].heldItem.sprites.default} style={{ width: 30, height: 30 }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h1>MOVES</h1>
                                        {!isNilAndLengthPlusZeroArray(team[0].teamArray[index].pokemonMoves) ? team[0].teamArray[index].pokemonMoves.map((ithMoves) => {
                                            return <p className=''>{ithMoves}</p>
                                        }) : null}
                                    </div>
                                </div>
                                <div className='wrapper-stats-pokemon'>
                                    <div>
                                        {!isNilOnly(team[0].teamArray[index].pokemonIVs) ?
                                            <div>
                                                <h1>IVs</h1>
                                                <p>HP:{team[0].teamArray[index].pokemonIVs.hp}</p>
                                                <p>ATTACK:{team[0].teamArray[index].pokemonIVs.attack}</p>
                                                <p>DEFENSE:{team[0].teamArray[index].pokemonIVs.defense}</p>
                                                <p>SPECIAL ATTACK:{team[0].teamArray[index].pokemonIVs.specialAttack}</p>
                                                <p>SPECIAL DEFENSE:{team[0].teamArray[index].pokemonIVs.specialDefense}</p>
                                                <p>SPEED:{team[0].teamArray[index].pokemonIVs.speed}</p>
                                            </div>
                                            : null}
                                    </div>
                                    <div>
                                        {!isNilOnly(team[0].teamArray[index].pokemonEVs) ?
                                            <div>
                                                <h1>EVs</h1>
                                                <p>HP:{team[0].teamArray[index].pokemonEVs.hp}</p>
                                                <p>ATTACK:{team[0].teamArray[index].pokemonEVs.attack}</p>
                                                <p>DEFENSE:{team[0].teamArray[index].pokemonEVs.defense}</p>
                                                <p>SPECIAL ATTACK:{team[0].teamArray[index].pokemonEVs.specialAttack}</p>
                                                <p>SPECIAL DEFENSE:{team[0].teamArray[index].pokemonEVs.specialDefense}</p>
                                                <p>SPEED:{team[0].teamArray[index].pokemonEVs.speed}</p>
                                            </div>
                                            : null}
                                    </div>
                                </div>
                                <Button onClick={() => handleAugmentIndex()}>Next Pokemon</Button>
                            </div>
                            : null}
                    </div>
                </div>
            </Modal>
            <Modal title="Scegli I Pokemon" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={customFooter}>
                {/* {
                    pokemonData.map((ithPokemonData) => {
                        return <div className='wrapper-pokemon-team'>
                            <p style={{ textTransform: 'uppercase' }}>{ithPokemonData.name}</p>
                            <div>
                                <Button>+</Button>
                                <Button style={{ marginLeft: 12 }}>Apri Il Pokedex</Button>
                            </div>
                        </div>
                    })
                } */}
                <Input style={{ marginTop: 12 }} placeholder='scegli il nome del team' onChange={(e) => handleNameTeam(e)} />
                <AutoComplete
                    onSearch={(value) => handleSearch(value)}
                    onSelect={(value) => handleSelect(value)}
                    placeholder="Search pokemon"
                    style={{ width: '100%' }}
                >
                    {options.map((option, index) => (
                        <Option key={index} value={option.name}>
                            {option.name}
                        </Option>
                    ))}
                </AutoComplete>
                {selectedValues.map((ithValue) => {
                    return <div className='wrapper-pokemon-team'>
                        <div className='sub-wrapper-pokemon-team'>
                            <img src={ithValue.sprites} style={{ width: 80 }} />
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                open={isOpenDropdown}
                                placement="bottomLeft"
                            ><p style={{ textTransform: 'uppercase' }} onClick={(e) => handleOpenMoveModal(e)}>{ithValue.name}</p></Dropdown>
                            {ithValue.types.map((ithTypes) => {
                                return <p className='paragraph-types'>{ithTypes}</p>
                            })}
                        </div>
                    </div>
                })}
            </Modal>
            <Modal title="Scegli Le mosse" open={isMoveOpen} onOk={handleOkMoves} onCancel={handleCancelMoves} footer={customFooterMoves}>
                <AutoComplete
                    onSearch={(value) => handleSearchMoves(value)}
                    onSelect={(value) => handleSelectMoves(value)}
                    placeholder="Search moves"
                    style={{ width: '100%' }}
                >
                    {optionsMosse.map((option, index) => (
                        <Option key={index} value={option}>
                            {option.name}
                        </Option>
                    ))}
                </AutoComplete>
                {pokemonMoves.map((ithMoves) => {
                    return <div className='wrapper-moves-div'>
                        <p className='paragraph-moves'>{ithMoves}</p>
                        <Button>-</Button>
                    </div>
                })}
            </Modal>
            <Modal title="Imposta le statistiche" open={isStatsOpen} onOk={handleOkStats} onCancel={handleCancelStats} footer={false}>
                <Form onFinish={(e) => handleEvs(e)} form={formEvs}>
                    <div>
                        <div>
                            <h1>EV's</h1>
                            <div>
                                <Form.Item
                                    label="HP"
                                    name="HPevs"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Hp!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    label="ATTACK"
                                    name="ATTACKevs"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Attack!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    label="DEFENSE"
                                    name="DEFENSEevs"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your DEFENSE!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    label="SPECIAL ATTACK"
                                    name="SPECIALATTACKevs"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your SPECIAL ATTACK!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    label="SPECIAL DEFENSE"
                                    name="SPECIALDEFENSEevs"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your SPECIAL DEFENSE!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    label="SPEED"
                                    name="SPEEDevs"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your SPEED!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </div>
                            {/* <button type="submit">set EVs</button> */}
                        </div>
                        <div>
                            <h1>IV's</h1>
                            <div>
                                {/* <Form onFinish={(e) => handleIvs(e)} form={formIvs}> */}
                                <div>
                                    <Form.Item
                                        label="HP"
                                        name="HPivs"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Hp!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label="ATTACK"
                                        name="ATTACKivs"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Attack!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label="DEFENSE"
                                        name="DEFENSEivs"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your DEFENSE!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label="SPECIAL ATTACK"
                                        name="SPECIALATTACKivs"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your SPECIAL ATTACK!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label="SPECIAL DEFENSE"
                                        name="SPECIALDEFENSEivs"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your SPECIAL DEFENSE!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Form.Item
                                        label="SPEED"
                                        name="SPEEDivs"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your SPEED!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                                <button type="submit">Set IVs and EVs</button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
            <div className='body-wrapper'>
                <div className='create-team-wrapper'>
                    <div className='wrapper-view-team'>
                        <h1 className='paragraph-style-show-team'>Ultimi Team Creati</h1>
                        <div className='menù-show-team'>
                            {isShown ? <Input onChange={(e) => handleChangeSearch(e)} className='input-search-team' placeholder='Search Team By Name'/> : null}
                            <SearchOutlined onClick={() => handleOnClickSearch()} style={{ marginLeft: 12 }} />
                            <ReloadOutlined onClick={() => handleOnClickReload()} style={{ marginLeft: 12 }} />
                        </div>
                    </div>
                    <div className='sub-create-team-wrapper'>
                        {pokemonTeam.map((ithTeam) => (
                            <div className='team-wrapper'>
                                {ithTeam.teamArray.map((ithPokemonTeam) => {
                                    return <div className='wrapper-team-info-dashboard'>
                                        <img src={ithPokemonTeam.sprites} style={{ width: 80 }} />
                                        <img src={ithPokemonTeam.heldItem.sprites.default} style={{ height: 30, marginLeft: -12 }} />
                                    </div>
                                })}
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => handleOpenModal()}>Create Team</Button>
                    <Button onClick={() => handleOpenModalViewInformation()} style={{ marginLeft: 12 }}>View Information</Button>
                </div>
            </div>
        </div>
    )
}

export default ViewTeam;