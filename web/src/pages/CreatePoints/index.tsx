import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './index.css';
//Link é utilizado para usar o conceito de SPA
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

const CreatePoint = () => {

  //Criando um estado
  //Sempre quando é criado um state para um array ou objeto, é necessarior informar o tipo da variavel
  //Informando os tipos das variaveis atraves de uma interface
  interface Item {
    id: number;
    title: string;
    item_url: string;
  }

  //<Item[]> é usado para informar para o state o tipo dele
  const [items, setItems] = useState<Item[]>([]);

  const history = useHistory();

  useEffect(() => {
    //É passado apenas 'items' para o axios pq lá nele já contem a base URL com o inicio da url utilizada
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

  interface IBGEUFResponse {
    sigla: string;
  }

  const [ufs, setUfs] = useState<string[]>([]);
  //state para armazenar o meu uf
  const [selectedUF, setselectedUF] = useState('0');

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      })
  }, []);

  interface IBGECytiResponse {
    nome: string;
  }


  const [city, setcity] = useState<string[]>([]);
  //state para armazenar a minha city
  const [selectedCity, setselectedCity] = useState('0');

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }
    axios.get<IBGECytiResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setcity(cityNames);
      });
  }, [selectedUF]);

  //Função para capturar o valor de uf
  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setselectedUF(uf);
  }

  //Função para capturar o valor da city
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setselectedCity(city);
  }

  //State para guardar a longitude e latitude
  const [selectedPosition, setselectedPosition] = useState<[number, number]>([0, 0]);

  //State para pegar a posição inicial do mapa sendo a posição atual do usuario
  const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    //Função para carregar a geolocalização atual do usuario 
    //navigator é uma variavel global
    //Não esta funcionando pode ser por conta de permissões ou internet 
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setinitialPosition([
        latitude,
        longitude
      ])
    });
  }, []);

  function handleMapClick(event: LeafletMouseEvent) {
    setselectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  //State para os inputs
  const [formData, setformData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  }

  //State para item selecionado
  const [selectedItem, setselectedItem] = useState<number[]>([]);

  function handleSelectedItem(id: number) {
    //Verificando se o item já foi selecionado
    //Se o id já estiver no selectedItem o findIndex retornara a posição dele
    const alreadySelected = selectedItem.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      //Adicionando no filteredItems todos os selectedItem que forem diferentes do id 
      const filteredItems = selectedItem.filter(item => item !== id)
      //adicionando eles no setselectedItem
      setselectedItem(filteredItems)
    } else {
      // ... para pegar tudo que tem dentro da selectedItem e adicionar o id
      setselectedItem([...selectedItem, id]);
    }

  }

  //Função para enviar para a API o ponto de coleta cadastrado 
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;

    const uf = selectedUF;

    const city = selectedCity;

    const [latitude, longitude] = selectedPosition;

    const items = selectedItem;

    const data = {
      name, email, whatsapp, uf, city, latitude, longitude, items
    }
    await api.post('points', data);
    alert('sucess');
    console.log(data);

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          {/* center={[longitudo, latitude]}  */}
          <Map center={[-23.5409192, -46.2994503]} zoom={15} onClick={handleMapClick}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUF}
                onChange={handleSelectUF}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf} >{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {city.map(city => (
                  <option key={city} value={city} >{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais item abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              //Sempre que é utilizado um map ou um iteração no react, 
              //o primeiro elemento tem que ter Key para que ele identifique mais rapido esse elemento
              //Para passar um parametro para uma função é necessario uma arrow function
              <li key={item.id}
                onClick={() => handleSelectedItem(item.id)}
                className={selectedItem.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.item_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}

          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>

      </form>
    </div>
  );
};

export default CreatePoint;