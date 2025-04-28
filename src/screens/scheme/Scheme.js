import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Text,
  Modal,
  Alert

} from "react-native";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import {
  useCheckActiveSchemeMutation,
  useCheckAllSchemeMutation,
} from "../../apiServices/scheme/GetSchemeApi";
import * as Keychain from "react-native-keychain";
import Logo from "react-native-vector-icons/AntDesign";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import Cancel from 'react-native-vector-icons/MaterialIcons'

export default function Scheme({ navigation }) {
  const [scheme, setScheme] = useState([]);
  const [getAllScheme, setGetAllScheme] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [activeScheme, setActiveScheme] = useState();
  const [selectedGifts, setSelectedGifts] = useState();
  const [categories, setCategories] = useState();
  const [stateCollapsed, setStateCollapsed] = useState(true);
  const [highlightWidthPrevious, setHighlightWidthPrevious] = useState(false);
  const [selected, setSelected] = useState(false);
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const location = useSelector((state) => state.userLocation.location);
  console.log("Location Data from redux state", location);
  const height = Dimensions.get("window").height;

  const [
    checkAllSchemeFunc,
    {
      data: checkAllSchemeData,
      error: checkAllSchemeError,
      isLoading: checkAllSchemeIsLoading,
      isError: checkAllSchemeIsError,
    },
  ] = useCheckAllSchemeMutation();

  const [
    checkActiveSchemeFunc,
    {
      data: checkActiveSchemeData,
      error: checkActiveSchemeError,
      isLoading: checkActiveSchemeIsLoading,
      isError: checkActiveSchemeIsError,
    },
  ] = useCheckActiveSchemeMutation();

 
  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const startDate = moment(new Date()).format("YYYY-MM-DD")
      const params = {
        token:token,
        endDate:startDate
      }
      checkAllSchemeFunc(params);
    };
    getToken();

  }, []);

  useEffect(() => {
    if (checkAllSchemeData) {
      console.log("checkAllSchemeData", checkAllSchemeData);
    } else if (checkAllSchemeError) {
      console.log("checkAllSchemeError", checkAllSchemeError);
    }
  }, [checkAllSchemeData, checkAllSchemeError]);

  // useEffect(() => {
  //   const currentScheme = checkAllSchemeData?.body?.filter((item, index) => {
  //     if (
  //       (item?.scheme_start <= moment(new Date()).format("YYYY-MM-DD")) &&
  //       (moment(new Date()).format("YYYY-MM-DD") <= item?.scheme_end)
  //     )
  //       return item;
  //   });
  //   setActiveScheme(currentScheme);
  //   console.log("current scheme", currentScheme);
  // }, [checkAllSchemeData]);

  useEffect(() => {
    if (checkAllSchemeData?.body) {
      console.log("💡 Raw scheme data received:");
      checkAllSchemeData.body.forEach((item, index) => {
        console.log(`👉 Scheme ${index + 1}`);
        console.log("Scheme Start:", item.scheme_start);
        console.log("Scheme End:", item.scheme_end);
        console.log("Today:", moment().format("YYYY-MM-DD"));
  
        const start = moment(item.scheme_start).isSameOrBefore(moment(), 'day');
        const end = moment(item.scheme_end).isSameOrAfter(moment(), 'day');
  
        console.log("Start Valid:", start);
        console.log("End Valid:", end);
      });
  
      const currentScheme = checkAllSchemeData.body.filter((item) => {
        return (
          moment(item.scheme_start).isSameOrBefore(moment(), 'day') &&
          moment(item.scheme_end).isSameOrAfter(moment(), 'day')
        );
      });
  
      console.log("✅ Filtered currentScheme:", currentScheme);
      setActiveScheme(currentScheme);
    }
  }, [checkAllSchemeData]);
  

 

  useEffect(() => {
    if (checkActiveSchemeData) {
      console.log(
        "checkActiveSchemeData",
        JSON.stringify(checkActiveSchemeData)
      );
      if (checkActiveSchemeData.success) {
        setScheme(checkActiveSchemeData.body.scheme);
        setGifts(checkActiveSchemeData.body.gifts);
        getCategories(checkActiveSchemeData.body.gifts);
        setSelectedGifts(checkActiveSchemeData.body.gifts);
      }
    } else if (checkActiveSchemeError) {
      console.log("checkActiveSchemeError", checkActiveSchemeError);
    }
  }, [checkActiveSchemeData, checkActiveSchemeError]);

  const getCategories = (data) => {
    const categoryData = data.map((item, index) => {
      return item.brand.trim();
    });
    const set = new Set(categoryData);
    const tempArray = Array.from(set);
    setCategories(tempArray);
  };

  const handlePress = (data) => {
    setSelectedGifts(data);
    setSelected(true);
  };

  const FilterSchemeComponent = () => {
    const [selectedDataStart, setSelectedDataStart] = useState(new Date());
    const [selectedDataEnd, setSelectedDataEnd] = useState(new Date());

    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            width: "44%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <PoppinsTextMedium
            content={`Start Date ${moment(selectedDataStart).format(
              "MM/YYYY"
            )}`}
            style={{ width: "60%", fontSize: 16, fontWeight: "700" }}
          ></PoppinsTextMedium>
          <TouchableOpacity
            style={{
              backgroundColor: ternaryThemeColor,
              paddingLeft: 10,
              borderRadius: 6,
              paddingRight: 10,
              padding: 6,
              marginTop: 10,
              marginLeft: 10,
            }}
            onPress={() => {
              setOpenStart(!openStart);
            }}
          >
            <DatePicker
              modal
              mode="date"
              open={openStart}
              date={selectedDataStart}
              onConfirm={(date) => {
                setOpenStart(false);
                setSelectedDataStart(date);
              }}
              onCancel={() => {
                setOpenStart(false);
              }}
            />
            <PoppinsTextMedium
              style={{ color: "white", fontWeight: "700" }}
              content=" Select"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 10,
            width: "44%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            borderLeftWidth: 1,
            marginLeft: 10,
          }}
        >
          <PoppinsTextMedium
            content={`End Date ${moment(selectedDataEnd).format("MM/YYYY")}`}
            style={{ width: "60%", fontSize: 16, fontWeight: "700" }}
          ></PoppinsTextMedium>
          <TouchableOpacity
            style={{
              backgroundColor: ternaryThemeColor,
              paddingLeft: 10,
              borderRadius: 6,
              paddingRight: 10,
              padding: 6,
              marginTop: 10,
              marginLeft: 10,
            }}
            onPress={() => {
              setOpenEnd(!openEnd);
            }}
          >
            <DatePicker
              modal
              mode="date"
              open={openEnd}
              date={selectedDataEnd}
              onConfirm={(date) => {
                setOpenEnd(false);
                setSelectedDataEnd(date);
              }}
              onCancel={() => {
                setOpenEnd(false);
              }}
            />
            <PoppinsTextMedium
              style={{ color: "white", fontWeight: "700" }}
              content=" Select"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SchemeComponent = (props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const image = props.image;
    const name = props.name;
    const worth = props.worth;
    const earnedPoints = props?.data?.point_earned;
    const coin = props.coin;
  
    return (
      <View
        style={{
          width: "90%",
          borderWidth: 0.2,
          borderColor: "#DDDDDD",
          elevation: 10,
          backgroundColor: ternaryThemeColor,
          borderRadius: 20,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingBottom:10
        }}
      >
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
              source={{ uri: props.data?.image }}
            ></Image>
            <TouchableOpacity style={{position:'absolute', top:0,right:0}} onPress={()=>{
              setModalVisible(false)
            }}>
              <Cancel name="cancel" size = {40} color="#FF3436"></Cancel>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>


        <View
          style={{
            width: "36%",
            height: "100%",
            
            borderColor: "#DDDDDD",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity onPress={()=>{
            setModalVisible(true)
          }}
            style={{
              height: 80,
              width: 80,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "white",
              marginTop: 20,
            }}
          >
            <Image
              style={{
                height: 80,
                width: 80,
                resizeMode: "contain",
                borderRadius: 10,
              }}
              source={{ uri: props.data?.image }}
            ></Image>
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                
                if ((props.data.redeem_start<= moment(new Date()).format("YYYY-MM-DD")) && (moment(new Date()).format("YYYY-MM-DD")<= props.data.redeem_end)) {
                  navigation.navigate("RedeemGifts", {
                    schemeType: 'quaterly',
                    schemeGiftCatalogue: props.data?.gift_catalogue,
                    schemeID: props.data?.id,
                    pointBalance : props?.data?.point_balance
                  });
                  console.log("schemeID",props.data?.id)
                } else {
                  console.log("Redemption date",new Date(props.data.redeem_start).getTime(),new Date(props.data.redeem_end).getTime())
                  alert(`Redemption window start date ${moment(props.data.redeem_start).format('DD-MM-YYYY')} ,window end date ${moment(props.data.redeem_end).format("DD-MM-YYYY'")}`);
                }
              }}
              style={{
                height: 30,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: secondaryThemeColor,
                borderRadius: 20,
              }}
            >
              <PoppinsTextMedium
                content="Redeem"
                style={{ color: props.data.states?.includes(location.state) ? "white" : 'black', fontWeight: "800", fontSize: 15 }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { props.data?.pdf ? navigation.navigate("PdfComponent", { pdf: props.data?.pdf }) : alert("Scheme PDF is not available yet") }}
              style={{
                height: 30,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#34a847",
                borderRadius: 20,
                marginTop: 8
              }}
            >
              <PoppinsTextMedium
                content="View Scheme"
                style={{ color: "white", fontWeight: "800", fontSize: 15 }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { navigation.navigate("SchemeHistory", { schemeID: props.data?.id, item:props.data }) }}
              style={{
                height: 30,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000000",
                borderRadius: 20,
                marginTop: 8
              }}
            >
              <PoppinsTextMedium
                content="History"
                style={{ color: "white", fontWeight: "800", fontSize: 15 }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: "60%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: 0,
            marginLeft: 10,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 16, fontWeight: "700" }}
            content={name}
          ></PoppinsTextMedium>
  
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              borderBottomWidth: 1,
              borderColor: "white",
              flexDirection: "row",
              paddingBottom:6
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                width: "70%",
                textAlign: "left",
              }}
              content={`Earned Points `}
            ></PoppinsTextLeftMedium>
            <Text style={{ textAlign: "left" }}></Text>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
                width: "30%",
              }}
              content={earnedPoints}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                textAlign: "left",
              }}
              content={"Scheme Start Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 10
              }}
              content={moment(props.data?.scheme_start).format("DD-MM-YYYY")}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 4,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                textAlign: "left",
              }}
              content={"Scheme End Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 10
              }}
              content={moment(props.data?.scheme_end).format("DD-MM-YYYY")}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 4,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                textAlign: "left",
              }}
              content={"Redemption Start Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 10
              }}
              content={moment(props.data?.redeem_start).format("DD-MM-YYYY")}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 4,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                textAlign: "left",
              }}
              content={"Redemption End Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 10
              }}
              content={moment(props.data?.redeem_end).format("DD-MM-YYYY")}
            ></PoppinsTextMedium>
          </View>
          {/* <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row', marginTop: 10,flexWrap:'wrap',marginBottom:20,borderTopWidth:1,borderColor:'white',paddingTop:4 }}>
            <PoppinsTextMedium content="Applicable States :" style={{ color: 'white', fontSize: 10 }}></PoppinsTextMedium>
  
            {props?.data?.states?.slice(0, 2).map((item, index) => (
            <PoppinsTextMedium
              key={index}
              content={`${item} ${index < 1 && props.data.states.length > 1 ? ',' : ''}`}
              style={{ color: 'white', fontSize: 10, marginLeft: index === 0 ? 0 : 5 }}
            />
          ))}
          {stateCollapsed &&  props?.data?.states.length > 2 && (
            <TouchableOpacity onPress={() => setStateCollapsed(!stateCollapsed)}>
              <PoppinsTextMedium
                content={`+ ${props.data.states.length - 2} more`}
                style={{ color: 'white', fontSize: 10, marginLeft: 5 }}
              />
            </TouchableOpacity>
          )}
          {
            !stateCollapsed && props?.data?.states?.map((item, index) => (
              index> 2 &&
              <TouchableOpacity onPress={() => setStateCollapsed(!stateCollapsed)}>
              <PoppinsTextMedium
                key={index}
                content={`${item}, `}
                style={{ color: 'white', fontSize: 10, marginLeft: index === 0 ? 0 : 5 }}
              />
              </TouchableOpacity>
            ))
          }
       
            
          </View> */}
        </View>
      </View>
    );
  };
  
  // const handleCurrentData=()=>{
  //   const currentScheme = checkAllSchemeData?.body?.filter((item,index)=>{
  //     if(((item?.scheme_start<= moment(new Date()).format("YYYY-MM-DD")) && ( moment(new Date()).format("YYYY-MM-DD")<= item?.scheme_end)))
  //     return item
  //   })
  //   setActiveScheme(currentScheme)
  //   console.log("current scheme", currentScheme)
  // }

  const handleCurrentData = () => {
    const currentScheme = checkAllSchemeData?.body?.filter((item) => {
      const isStartValid = moment(item.scheme_start).isSameOrBefore(moment(), 'day');
      const isEndValid = moment(item.scheme_end).isSameOrAfter(moment(), 'day');
      return isStartValid && isEndValid;
    });
  
    setActiveScheme(currentScheme);
    console.log("✅ current scheme (filtered):", currentScheme);
  };
  


  // const handlePreviousData=()=>{
  //   const currentScheme = checkAllSchemeData?.body?.filter((item,index)=>{
  //     if((( moment(new Date()).format("YYYY-MM-DD") > item?.scheme_end)))
  //     return item
  //   })
  //   setActiveScheme(currentScheme)
  //   console.log("current scheme", currentScheme)
  // }

  const handlePreviousData = () => {
    const currentScheme = checkAllSchemeData?.body?.filter((item) => {
      return moment().isAfter(moment(item.scheme_end), 'day');
    });
  
    setActiveScheme(currentScheme);
    console.log("📦 previous schemes (filtered):", currentScheme);
  };
  

  const FilterComp = (props) => {
    const [color, setColor] = useState("#F0F0F0");
    const [selected, setSelected] = useState(props.selected);
    const title = props.title;
    const togglebox = () => {
      setSelected(!selected);
      console.log("selected", selected);

      if (!selected) {
        const temp = [...gifts];
        const filteredArray = temp.filter((item, index) => {
          console.log("From filter", item.brand, title);
          return item.brand === title;
        });
        console.log("filteredArray", filteredArray);
        // setSelectedGifts(filteredArray)
        props.handlePress(filteredArray);
      }
    };
    console.log("selected", selected);
    return (
      <TouchableOpacity
        onPress={() => {
          togglebox();
        }}
        style={{
          minWidth: 60,
          height: 40,
          padding: 10,
          backgroundColor: selected ? secondaryThemeColor : "#F0F0F0",
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
          borderRadius: 4,
        }}
      >
        <PoppinsTextMedium
          style={{ fontSize: 12, color: selected ? "white" : "black" }}
          content={title}
        ></PoppinsTextMedium>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height: "100%",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: 30,
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content="Scheme"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "white",
          }}
        ></PoppinsTextMedium>
      </View>

      <View
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: "white",
          minHeight: height - 30,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            height: 50,
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: "#DDDDDD",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setHighlightWidthPrevious(false);
              handleCurrentData();
            }}
            style={{
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: highlightWidthPrevious ? 0 : 3,
              borderColor: ternaryThemeColor,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "grey", fontSize: 16, fontWeight: "600" }}
              content="Current"
            ></PoppinsTextMedium>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setHighlightWidthPrevious(true);
              handlePreviousData();
            }}
            style={{
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: highlightWidthPrevious ? 3 : 0,
              borderColor: ternaryThemeColor,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "grey", fontSize: 16, fontWeight: "600" }}
              content="Previous"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>

        {/* <FilterSchemeComponent></FilterSchemeComponent> */}
        <ScrollView style={{ width: "100%", marginBottom: 100 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {gifts &&
              gifts.map((item, index) => {
                return (
                  <SchemeComponent
                    key={index}
                    name={item.name}
                    worth={item.value}
                    coin={item.points}
                    image={item.images[0]}
                  ></SchemeComponent>
                );
              })} */}
            {activeScheme &&
              activeScheme.map((item, index) => {
                return (
                  <SchemeComponent
                  data={item}
                  key={index}
                  name={item.name}
                  worth={"10000"}
                  coin={10}
                  image={item?.gift_catalogue?.[0]?.images?.[0]} // ✅ better
                  earnedPoints={item?.point_earned}
                />
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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