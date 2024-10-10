import axios from "axios";
import { useEffect, useState } from "react";
import imgLogo from '../../assets/logo.png'
import { Select, Spin } from "antd";
import { isNil, isNilAndLengthPlusZero, isNilAndLengthPlusZeroArray, isNilOnly } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import DropdownCustom from "../../components/dropdown/DropdownCustom";
import { Virtuoso } from "react-virtuoso"
import "./pokedex.css";

const Pokedex = () => {

    const photoUrl = isNil(useSelector((state) => state.auth.photoUrl)) ? sessionStorage.getItem('photoUrl') : useSelector((state) => state.auth.photoUrl);
    const navigate = useNavigate();
    const [singlePokemonData, setSinglePokemonData] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [name, setName] = useState([]);
    const [generation, setGeneration] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pokemonInfo, setPokemonInfo] = useState({});
    const [pokemonLocation, setPokemonLocation] = useState([]);

    useEffect(() => {
        (async function () {
            getPokemonData();
        })();
    }, [generation])

    // useEffect(() => {
    //     (async function () {
    //         getPokemonImageFromUrl();
    //     })();
    // }, [generation])


    const getPokemonData = async () => {
        setLoading(true);
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/generation/${generation}`); /* prendere i dati per generazione e non in maniera bulk */
        const pokemonData = pokemonResponse.data;
        if (singlePokemonData.length > 0) {
            setSinglePokemonData([]);
        }
        if (!isNilOnly(pokemonData) && !isNilOnly(pokemonData.pokemon_species)) {
            for (const ithPokemon of pokemonData.pokemon_species) {
                console.log("pokemon", ithPokemon);
                const pokemonImg = await axios.get(ithPokemon.url);
                console.log("pokemonImage", pokemonImg.data);
                const pokemonImgData = await axios.get(pokemonImg.data.varieties[0].pokemon.url);
                // singlePokemonData.push(pokemonImgData.data);
                setSinglePokemonData(prevData => [...prevData, pokemonImgData.data]);
            }
        }
        setLoading(false);
    }

    const getDataPokedex = async (e) => {
        const pokemonData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${e.target.innerText.toLowerCase()}`);
        setPokemonInfo(pokemonData.data);
        const locationArea = await axios.get(pokemonData.data.location_area_encounters);
        setPokemonLocation(locationArea.data);
    }

    const getPokemonEvolution = async () => {

    }

    return (
            <div className="wrapper-pokedex-component">
                <div className="wrapper-menù">
                    <img src={imgLogo} className='img-logo' />
                    <div className='wrapper-ul'>
                        <ul className='ul-menù'>
                            <li className='li-items' onClick={() => { navigate("/") }}>Home</li>
                            <li className='li-items' onClick={() => { navigate("/pokedex") }}>Pokedex</li>
                            <li className='li-items' onClick={() => { navigate("/chat") }}>Chat</li>
                        </ul>
                    </div>
                    {/* <img src={imgLogo} className='img-profile-pic' /> */}
                    {isNil(photoUrl) ? <div className='img-profile-pic' onClick={() => setOpenDropdown((prev) => prev = !prev)}></div> : <img src={photoUrl} className='img-profile-pic' onClick={() => setOpenDropdown((prev) => prev = !prev)} />}
                    {openDropdown && <DropdownCustom />}
                </div>
                <div className="wrapper-page-pokedex">
                    <div className="wrapper-pokedex-elements">
                        <Select onChange={(value) => setGeneration(value)} value={generation} style={{ marginBottom: 12 }}>
                            <Select.Option value={1}>1° gen</Select.Option>
                            <Select.Option value={2}>2° gen</Select.Option>
                            <Select.Option value={3}>3° gen</Select.Option>
                            <Select.Option value={4}>4° gen</Select.Option>
                            <Select.Option value={5}>5° gen</Select.Option>
                            <Select.Option value={6}>6° gen</Select.Option>
                            <Select.Option value={7}>7° gen</Select.Option>
                            <Select.Option value={8}>8° gen</Select.Option>
                            <Select.Option value={9}>9° gen</Select.Option>
                        </Select>
                        {/*{singlePokemonData.map((ithData, index) => (
                            <div className="element-pokedex">
                                <img src={ithData.sprites.other.showdown.front_default} className="img-pokemon" />  {/*ithData.sprites.other.dream_world.front_default 
                                <p style={{ color: "white", fontSize: 18, textTransform: "uppercase" }} onClick={(e) => getDataPokedex(e)}>{ithData.name}</p>
                            </div>
                        ))} */}
                        <Virtuoso data={singlePokemonData} itemContent={(_, ithData) => (
                            <div className="element-pokedex">
                                <img src={ithData.sprites.other.showdown.front_default} className="img-pokemon" />
                                <p style={{ color: "white", fontSize: 18, textTransform: "uppercase" }} onClick={(e) => getDataPokedex(e)}>{ithData.name}</p>
                            </div>
                        )} className="virtuoso-div" />
                    </div>
                    <div className="wrapper-info-pokemon">
                        {isNilAndLengthPlusZero(pokemonInfo) ? null : <div className="first-row">
                            <div className="first-element-row">
                                <div className="wrapper-types">
                                    <img src={pokemonInfo.sprites.other.showdown.front_default} />
                                    <h1 style={{ color: "white", fontSize: 32, textTransform: "uppercase" }}>{pokemonInfo.name}</h1>
                                    {pokemonInfo.types.map((ithTypes) => {
                                        return <p className='types-paragraph'>{ithTypes.type.name}</p>
                                    })}
                                </div>
                                <h2 style={{ color: "white", padding: 8, fontSize: 22, }}>ABILITY</h2>
                                {pokemonInfo.abilities.map((ithAbilities) => {
                                    return <p style={{ color: "white", padding: 8, textTransform: "capitalize" }}>{ithAbilities.ability.name}</p>
                                })}
                            </div>
                            <div className="wrapper-statistiche">
                                <h2 style={{ color: "white", fontSize: 22 }}>STATISTICHE</h2>
                                {pokemonInfo.stats.map((ithStats) => {
                                    return <div className="stats-wrapper">
                                        <p style={{ color: "white", textTransform: "uppercase" }}>{ithStats.stat.name}:</p>
                                        <p style={{ color: "white" }}>{ithStats.base_stat}</p>
                                    </div>
                                })}
                            </div>
                            <div>
                                <h2 style={{ color: "white", fontSize: 22 }}>LOCATION AREA ENCOUNTER</h2>
                                {
                                    isNilAndLengthPlusZeroArray(pokemonLocation) ? null :
                                        pokemonLocation.map((ithLocation) => {
                                            return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                <div className="locationAreaEncounter">
                                                    <p style={{ color: "white" }}>versione Gioco: {ithLocation.version_details.map(((ithName) => (ithName.version.name)))}</p>
                                                    <p style={{ color: "white" }}>percorso: {ithLocation.location_area.name}</p>
                                                </div>
                                            </div>
                                        })
                                }
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
    )
}

export default Pokedex;