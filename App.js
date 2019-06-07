import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import MapView from 'react-native-maps';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import colors from './assets/colors';

class App extends Component {
  constructor() {
    super();
    this.state = {
      customStyleIndex: 0,
      posts: [],
      postsMapa: [],
      places: [
        {
          id: 1,
          latitude: -27.2106710,
          longitude: -49.6362700,
        }
      ]
    };

    OneSignal.init("f9eac7f9-f9b6-46ae-bfd3-7b59b8ea19cb");

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure(); 	// triggers the ids event
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  componentDidMount() {
    this.loadDadosRecebidos();
    this.loadDadosMapa();
  }

  loadDadosRecebidos = async () => {
    const res = await axios.get("http://api.smileb.com.br/api/TesteDesenvolvimento/DadosRecebidos/", {
      headers: {
        'Content-Type': 'application/json',
        'token': 'rtf8c26a-e90d-47af-b16f-678a9f45d907',
        'User-Agent': 'PostmanRuntime/7.13.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': 'feaaff9b-c33d-453f-b3c7-fc65db04c2e2,978cfb3d-a33e-4d59-a3f4-24e2f7657ca1',
        'Host': 'api.smileb.com.br',
        'accept-encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'cache-control': 'no-cache'
      }
    }).then((res) => {
      const posts = res.data.map(obj => ({ nome: obj.nome, endereco: obj.endereco, telefone: obj.telefone, quantidadeCurtidas: obj.quantidadeCurtidas }));
      this.setState({ posts });
    })
      .catch(error => {
        console.log(error);
      });
  };

  loadDadosMapa = async () => {
    const resMapa = await axios.get("http://api.smileb.com.br/api/TesteDesenvolvimento/DadosMapa/", {
      headers: {
        'Content-Type': 'application/json',
        'token': 'rtf8c26a-e90d-47af-b16f-678a9f45d907',
        'User-Agent': 'PostmanRuntime/7.13.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': 'feaaff9b-c33d-453f-b3c7-fc65db04c2e2,978cfb3d-a33e-4d59-a3f4-24e2f7657ca1',
        'Host': 'api.smileb.com.br',
        'accept-encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'cache-control': 'no-cache'
      }
    }).then((resMapa) => {
      const postsMapa = resMapa.data.map(obj => ({ id: obj.id, latitude: obj.latitude, longitude: obj.longitude }));
      this.setState({ postsMapa });
    })
      .catch(error => {
        console.log(error);
      });
  };


  renderItem = ({ item }) => (
    <View style={styles.boxList} >
      <View style={styles.boxListLight} >
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image style={styles.iconTooth} source={require('./assets/images/tooth_icon.png')} />
          <Text style={styles.userName}>{item.nome}</Text>
        </View>

        <View style={styles.hairline} />

        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image style={styles.iconLocal} source={require('./assets/images/address_icon.png')} />
          <Text style={styles.endereco}>{item.endereco}</Text>
        </View>

        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image style={styles.iconTel} source={require('./assets/images/phone_icon.png')} />
          <Text style={styles.telefone}>{item.telefone}</Text>
        </View>


        <View style={styles.botaoCancelar}>
          <TouchableOpacity>
            <View style={styles.textBotaoCancelar}><Text style={{ fontSize: 12, padding: 3, marginTop: -2, color: colors.primary, }}>Cancelar</Text></View>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.boxListBlue} >
        <Text style={{ color: '#FFF', padding: 10, fontSize: 12 }}>Você tem</Text>
        <View style={styles.circleNumber} ><Text style={{ color: '#FFf', fontSize: 25, fontFamily: 'Roboto Regular' }}>{item.quantidadeCurtidas}</Text></View>
        <Text style={{ color: '#FFF', padding: 10, fontSize: 12 }}>Curtidas</Text>
        <TouchableOpacity>
          <Image style={styles.iconArrowRight} source={require('./assets/images/arrow_right_icon.png')} />
        </TouchableOpacity>
      </View>
    </View>


  );

  handleCustomIndexSelect = (index: number) => {
    //handle tab selection for custom Tab Selection SegmentedControlTab
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
  };

  render() {
    const { customStyleIndex } = this.state;

    const { latitude, longitude } = this.state.places[0];

    return (


      <View style={styles.container}>

        <Text style={styles.titleHeader}>Consultas</Text>
        <View style={styles.containerMenu}>
          <Image style={styles.bakcgroundImage} source={require('./assets/images/header_bg.png')}
          />

        </View>
        <View style={styles.segment} >
          <SegmentedControlTab
            values={['Recebidos', 'Mapa']}
            selectedIndex={customStyleIndex}
            onTabPress={this.handleCustomIndexSelect}
            tabsContainerStyle={{ height: 45, backgroundColor: 'transparent', marginLeft: 20, marginRight: 100 }}
            tabStyle={{
              backgroundColor: 'transparent',
              borderTopRightRadius: 7,
              borderTopLeftRadius: 7,
              borderColor: 'transparent',

            }}
            activeTabStyle={{ backgroundColor: 'white' }}
            tabTextStyle={{ color: '#FFF', fontWeight: 'bold' }}
            activeTabTextStyle={{ color: colors.primary }}
          />
          {customStyleIndex === 0 && (
            <View style={styles.tabContent}>

              <View style={styles.containerRecebidos}>

                <FlatList
                  data={this.state.posts}
                  keyExtractor={item => item.nome}
                  renderItem={this.renderItem}
                />


              </View>


            </View>

          )}

          {customStyleIndex === 1 && (

            <View style={styles.containerMapa}>
              <MapView
                ref={map => this.mapView = map}
                initialRegion={{
                  latitude: -20.1385735,
                  longitude: -44.8915522,
                  latitudeDelta: 0.0142,
                  longitudeDelta: 0.0231,
                }}
                style={styles.mapView}
                rotateEnabled={true}
                scrollEnabled={true}
                zoomEnabled={true}
                showsPointsOfInterest={false}
                showBuildings={false}
                onMapReady={this._mapReady}
              >
                {this.state.postsMapa.map(place => (
                  <MapView.Marker
                    ref={mark => place.mark = mark}
                    key={place.id}
                    coordinate={{
                      latitude: place.latitude,
                      longitude: place.longitude,
                    }}
                  />
                ))}
              </MapView>
            </View>



          )}


        </View>


        <View style={styles.containerFooter}>
          <View style={styles.box}>
            <TouchableOpacity>
              <Image style={styles.iconsFooter} source={require('./assets/images/home_menu_icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity>
              <Image style={styles.iconsFooter} source={require('./assets/images/leilao_icone.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity>
              <Image style={styles.iconsFooter} source={require('./assets/images/calendar_menu_icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <TouchableOpacity>
              <Image style={styles.iconsFooter} source={require('./assets/images/pesquisar_icone.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.box}>
            <TouchableOpacity>
              <Image style={styles.iconsFooter} source={require('./assets/images/bell_menu_icon.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{

                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                position: 'absolute',
                bottom: 30,
                right: 15,
                height: 16,
                backgroundColor: '#FE7B7B',
                borderRadius: 100,
              }}
            >
              <Text style={styles.redBell}>3</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.box}>
            <TouchableOpacity>
              <Image style={styles.iconsFooter} source={require('./assets/images/more_menu-icon.png')}
              />
            </TouchableOpacity>
          </View>

        </View>


      </View>





    );
  }
}

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  segment: {
    marginTop: -40,
    backgroundColor: 'transparent'
  },
  tabContent: {
    marginTop: 20,
    color: '#444444',
    fontSize: 18,
    height: 385,

  },
  tabStyle: {
    borderColor: '#D52C43',
  },
  activeTabStyle: {
    backgroundColor: '#D52C43',
  },
  container: {
    flex: 1,
  },
  containerFooter: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 70,
    borderWidth: 1,
    borderColor: '#DDD',
    flex: 1
  },
  containerRecebidos: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: -30
  },
  boxList: {
    flexDirection: 'row',
    padding: 0,
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 10,

  },
  boxListLight: {
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
    backgroundColor: '#FFF',
    flex: 0.7
  },
  boxListBlue: {
    color: '#FFF',
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: colors.primary,
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'Roboto Regular'
  },
  endereco: {
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Roboto Regular',
    fontSize: 12
  },
  telefone: {
    marginTop: -13,
    paddingLeft: 10,
    fontFamily: 'Roboto Regular',
    fontSize: 12
  },
  circleNumber: {
    width: 50,
    height: 50,
    color: '#FFF',
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 44,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconArrowRight: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  hairline: {
    backgroundColor: '#d3d3d3',
    height: 0.5,
    width: '100%',
    marginTop: -8,
    marginLeft: 12
  },
  iconTooth: {
    marginTop: 3,
    width: 16,
    height: 16,
    resizeMode: 'contain'
  },
  iconLocal: {
    marginTop: 10,
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  iconTel: {
    marginTop: -10,
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  botaoCancelar: {
    textAlign: 'left',
    marginTop: 30,
    margin: 15,
  },
  textBotaoCancelar: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    marginRight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHeader: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: "Roboto Regular",
    margin: 20,
    marginLeft: 25
  },
  containerMain: {
    flex: 1,
    backgroundColor: 'gray',
    width: width,
    height: height
  },
  body: {
    flex: 1,
  },
  containerMenu: {

  },
  bakcgroundImage: {
    width: null,
    height: 80,
  },
  box: {
    flex: 1,
    margin: 2
  },
  iconsFooter: {
    height: 25,
    width: 25,
    marginTop: 20,
    margin: 10,
    padding: 10,
    resizeMode: 'contain'
  },
  redBell: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  containerMapa: {
    height: 405,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#FFF'
  },

  mapView: {
    position: 'absolute',
    top: 20,
    left: 0,
    bottom: 30,
    right: 0,
    width: '100%',
    height: 300
  },
});

export default App;
