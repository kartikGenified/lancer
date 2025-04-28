import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Modal
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import * as Keychain from "react-native-keychain";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useGetSchemeHistoryMutation } from "../../apiServices/scheme/SchemeHistoryApi";
import moment from "moment";
import Cancel from 'react-native-vector-icons/MaterialIcons'


const SchemeHistory = ({ route }) => {

  const { schemeID, item } = route.params;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const primaryThemeColor = useSelector(
    (state) => state.apptheme.primaryThemeColor
  );
  const navigation = useNavigation();

  const [highlightWidthPointEnteries, setHighlightWidthPointEnteries] = useState(true);
  const [pointEntries, setPointEntries] = useState([]);
  const [giftRedemptions, setGiftRedemptions] = useState([]);

  const [
    getSchemeHistory,
    {
      data: getSchemeHistoryData,
      error: getSchemeHistoryError,
      isLoading: getSchemeHistoryIsLoading,
      isError: getSchemeHistoryIsError,
    },
  ] = useGetSchemeHistoryMutation();

  const handleCurrentData = () => {

    console.log("Handling current data")
    
    if (getSchemeHistoryData) {
      setPointEntries(getSchemeHistoryData?.body["point-entries"]);
    }

    
  };

  const handlePreviousData = () => {
    if (getSchemeHistoryData) {
      setGiftRedemptions(getSchemeHistoryData?.body["gift-redemptions"]);
    }

   
  };

  useEffect(() => {
    handleCurrentData();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      console.log("scheme id", schemeID);
      const params = { token: token, id: schemeID };

      getSchemeHistory(params);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (getSchemeHistoryData) {
      console.log("getSchemeHistoryData", JSON.stringify(getSchemeHistoryData));
      if (highlightWidthPointEnteries) {
        console.log("highlightWidthPointEnteries",highlightWidthPointEnteries)
        handleCurrentData();
      } else {

        handlePreviousData();
      }
    } else {
      console.log(getSchemeHistoryError);
    }
  }, [getSchemeHistoryData, getSchemeHistoryError,highlightWidthPointEnteries]);

  const RenderPointEntry = ({ item }) => (
    <View style={styles.entryContainer}>
      <View style={{ flexDirection: "row",alignItems:'center',justifyContent:'center' }}>
        <View style={{alignItems:'center', justifyContent:'center',borderWidth: 2,
            borderColor: "#DDDDDD",padding:4,borderRadius:8}}>
        <Image
          style={{
            height: 50,
            width: 60,
            resizeMode: "contain",
            marginBottom: 10,
            
            
          }}
          source={require("../../../assets/images/lancer_logo.jpg")}
        />
        </View>
     
        <View style={{marginLeft:10}}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Product Code :</Text>
            <Text style={styles.value}>{item.product_code}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Product Name :</Text>
            <Text style={styles.value}>{item.product_name}</Text>
          </View>
          {/* <View style={styles.cardRow}>
            <Text style={styles.label}>MRP:</Text>
            <Text style={styles.value}>{item.MRP}</Text>
          </View> */}
          <View style={styles.cardRow}>
            <Text style={styles.label}>Points :</Text>
            <Text style={styles.value}>{item.points}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Claimed Date :</Text>
            <Text style={styles.value}>{moment(item.created_at).format("DD-MM-YYYY")}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const RenderGiftRedemption = (props) => {
  const [modalVisible, setModalVisible] = useState(false)

    return (
      <View style={styles.entryContainer}>
      <View style={{ flexDirection: "row",width:'100%' }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Image
              style={{
                height: 300,
                width: 300,
                resizeMode: "contain",
                borderRadius: 10,
              }}
              source={{ uri: props.item.gift?.gift[0]?.images[0] }}
            ></Image>
            <TouchableOpacity style={{position:'absolute', top:0,right:0}} onPress={()=>{
              setModalVisible(false)
            }}>
              <Cancel name="cancel" size = {40} color="#FF3436"></Cancel>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
        <TouchableOpacity onPress={()=>{
          setModalVisible(true)
        }} style={{alignItems:'center', justifyContent:'center', marginLeft:0,width:'20%'}}>
        <Image
          style={{
            height: 50,
            width: 70,
            resizeMode: "contain",
            marginBottom: 10,
            borderWidth: 1,
            borderColor: "black",
          }}
          source={{uri:props.item.gift?.gift[0]?.images[0]}}
        />
        </TouchableOpacity>
     
        <View style={{marginLeft:20,width:'80%'}}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Redeemed Points:</Text>
            <Text style={styles.value}>{props.item.points}</Text>
          </View>
          {/* <View style={styles.cardRow}>
            <Text style={styles.label}>Last Balance:</Text>
            <Text style={styles.value}>{props.item.last_balance}</Text>
          </View> */}
          <View style={styles.cardRow}>
            <Text style={styles.label}>Gift:</Text>
            <Text style={styles.value}>{props.item?.gift?.gift[0]?.name}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Brand:</Text>
            <Text style={styles.value}>{props.item?.gift?.gift[0]?.brand}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{moment(props.item.created_at).format("DD-MM-YYYY")}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Redemption Status:</Text>
            <Text style={styles.value}>{(props?.item?.status == "1" ? "Approved" : props?.item?.status == "2" ? "Rejected/Points reverted to wallet" : "Pending")}</Text>
          </View>
          {props?.item?.status =="1" && <View style={styles.cardRow}>
            <Text style={{...styles.label,color:ternaryThemeColor }}>Tracking Status:</Text>
            <Text  style={{...styles.value,textTransform:'capitalize',color:ternaryThemeColor,fontWeight:'600',textAlign:'auto'}}>{props.item?.statusUpdateDetails[props.item.statusUpdateDetails.length-1]?.status_name}</Text>
          </View>}
        </View>
      </View>
    </View>
    )
   
        };

  const WalletCard = ({ schemeItem }) => {
    return (
      <View style={{...styles.cardBody,}}>
        <View style={{ alignItems: "center", flexDirection:'row' }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Point Balance : 
          </Text>
          <PoppinsTextMedium
            style={{ fontSize: 18, fontWeight: "bold",color:'white' }}
            content={` ${schemeItem.point_balance}`}
          ></PoppinsTextMedium>
        </View>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <PoppinsTextLeftMedium
            style={{ color: "white", marginLeft: 10, fontWeight: "800" }}
            content={"Point Earned : " + schemeItem.point_earned}
          ></PoppinsTextLeftMedium>
          <PoppinsTextLeftMedium
            style={{ color: "white", fontWeight: "800",marginLeft:20 }}
            content={"Point Redeemed : " + schemeItem.point_redeemed}
          ></PoppinsTextLeftMedium>
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          
          <PoppinsTextLeftMedium
            style={{
              color:
                schemeItem.wallet_status == 0
                  ? "#60100B"
                  : schemeItem.wallet_status == 1
                  ? "#006400"
                  : schemeItem.wallet_status == 2
                  ? "white"
                  : schemeItem.wallet_status == 3
                  ? "#60100B"
                  : "white",
              fontWeight: "800",
              marginLeft:20
            }}
            content={
              "Wallet Status : " +
              (schemeItem.wallet_status == 0
                ? "Deleted"
                : schemeItem.wallet_status == 1
                ? "Active"
                : schemeItem.wallet_status == 2
                ? "Inactive"
                : schemeItem.wallet_status == 3
                ? "Freezed"
                : "")
            }
          ></PoppinsTextLeftMedium>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: ternaryThemeColor,
          backgroundColor: ternaryThemeColor,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          />
        </TouchableOpacity>
        <PoppinsTextMedium
          content="Scheme History"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "white",
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          
          alignItems:'center',
          
          backgroundColor: ternaryThemeColor,
          height:30,
          width:'100%'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setHighlightWidthPointEnteries(true);
            handleCurrentData();
          }}
          style={{
            borderBottomWidth: highlightWidthPointEnteries ? 3 : 0,
            borderColor: "black",
            
            height:'100%',
            width:'50%',
          }}
        >
          <PoppinsTextMedium style={{fontSize:16,color:'white',fontWeight:'700'}} content="Point Entries" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setHighlightWidthPointEnteries(false);
            handlePreviousData();
          }}
          style={{
            height:'100%',
            width:'50%',
            borderBottomWidth: highlightWidthPointEnteries ? 0 : 3,
            borderColor: "black",
            
            
          }}
        >
          <PoppinsTextMedium style={{fontSize:16,color:'white',fontWeight:'700'}} content="Gift Redemption" />
        </TouchableOpacity>
      </View>

      
        <View
          style={[styles.cardContainer, { backgroundColor: ternaryThemeColor,borderColor:"black" }]}
        >
          <WalletCard schemeItem={item} />
        </View>

        {highlightWidthPointEnteries ? (
          <FlatList
            data={pointEntries}
            renderItem={({item}) => <RenderPointEntry item = {item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <FlatList
            data={giftRedemptions}
            renderItem={({item}) => <RenderGiftRedemption item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
     
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth:2,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBody: {
    alignItems:'center',justifyContent:'space-between'
  },
  entryContainer: {
    backgroundColor: "#EEEEEE",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems:'flex-start',
    justifyContent:'center',
    width:'100%'
  },
  label: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
  cardRow: {
    width:'100%',
    // backgroundColor:'red',
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 2,
    alignItems:'center',flexWrap:"wrap"
  },
  value: {
    color: "black",
    fontSize: 13,
    fontWeight: "normal",
    marginLeft:4
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SchemeHistory;
