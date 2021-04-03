import React, { Component, Profiler, useState, useEffect, useCallback } from "react";
import {
  Image,
  TextInput,
  Animated,
  Text,
  View,
  StyleSheet,
  StatusBar,
  Button,
  ActivityIndicator
} from "react-native";
import Constants from "expo-constants";
import Svg, { G, Circle, Rect } from "react-native-svg";

import firebase from "firebase";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

import Donut from "./Donut";
import EditProfileScreen from "./EditProfile";
import LoaderScreen from "../../Loader";

const getSubmissions = (submissions, verdict) =>
  submissions.filter((submission) => submission.verdict === verdict);

const isSameProblem = (p1, p2) =>
  p1.name === p2.name && Math.abs(p1.contestId - p2.contestId) <= 1;
  
const removeDuplicateProblems = (submissions) => {
  submissions.sort((a, b) =>
    a.problem.name === b.problem.name
      ? a.problem.contestId - b.problem.contestId
      : a.problem.name < b.problem.name
        ? -1
        : 1
  );
  return submissions.filter(
    ({ problem }, index) =>
      !index || !isSameProblem(submissions[index - 1].problem, problem)
  );
};

const getProblems = (submissions) => {
  const ac = getSubmissions(submissions, "OK");
  return removeDuplicateProblems(ac);
};

export default function Profile({ navigation }) {
  const [profilePicture, setProfilePicture] = useState("https://meetanentrepreneur.lu/wp-content/uploads/2019/08/profil-linkedin.jpg");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [CFHandle, setCFHandle] = useState("");
  const [cfDataLoaded, setCfDataLoaded] = useState(false);
  const [firebaseLoaded1, setfirebaseLoaded1] = useState(false);
  const [firebaseLoaded2, setfirebaseLoaded2] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [totalCodeforcesSolved, setTotalCodeforcesSolved] = useState(0);

  //Codeforces Section
  const get_codeforces_data = useCallback(()=>{
    let link = "https://codeforces.com/api/user.status?handle={handle}"; //Recive all submissions
    link = link.replace("{handle}", CFHandle);
    fetch(link)
      .then((res) => res.json())
      .then((res) => res.result)
      .then((res) => {
        setSubmissions(res);
        setCfDataLoaded(true);
        const ac = getProblems(res)
        setTotalCodeforcesSolved( ac.length );
      });
  })

  // Firebase Section
  const current_user_data = useCallback(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        //console.log(snapshot);
        setName(snapshot.data().name);
        setUserName(snapshot.data().username);
        setEmail(snapshot.data().email);
        setCFHandle(snapshot.data().CFHandle);
        setfirebaseLoaded1(true);
      });
      console.log("One")
    })
    
    const get_user_profile_data = () => {
      firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setProfilePicture(snapshot.data().downloadURL)
        }
        setfirebaseLoaded2(true);
      });
      console.log("Two")
  }

  const onLogout = () => {
    console.log("Logged out!");
    firebase.auth().signOut();
    navigation.navigate("Splash");
  };

  if (!firebaseLoaded1) {
    current_user_data();
    return (
      <View style={[styles.activitycontainer, styles.horizontal]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
  if (firebaseLoaded1 && !firebaseLoaded2) {
    get_user_profile_data();
    return (
      <View style={[styles.activitycontainer, styles.horizontal]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if(firebaseLoaded1 && firebaseLoaded2 && !cfDataLoaded){
    get_codeforces_data();
    return (
      <View style={[styles.activitycontainer, styles.horizontal]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (firebaseLoaded1 && firebaseLoaded2 && cfDataLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <StatusBar
          animated={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.titleBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="#52575D" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Feather name="edit" size={24} color="#52575D" />
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: "center" }}>
            <View style={styles.profileImage}>
              <Image
                style={styles.image}
                source={{ uri: profilePicture }}
                resizeMode="cover"
              />
            </View>
            <View style={styles.dm}>
              <MaterialIcons name="chat" size={18} color="#DFD8C8" />
            </View>
            <View style={styles.active}></View>
            <View style={styles.add}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PickImage")}
              >
                <Ionicons
                  name="ios-add"
                  size={48}
                  color="#DFD8C8"
                  style={{ marginTop: 0, marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
              {name}
            </Text>
            <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>
              {email}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 24 }]}>14</Text>
              <Text style={[styles.ext, styles.subText]}>last 7 days </Text>
            </View>

            <View
              style={[
                styles.statsBox,
                {
                  borderColor: "#DFD8C8",
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                },
              ]}
            >
              <Text style={[styles.text, { fontSize: 24 }]}>67</Text>
              <Text style={[styles.ext, styles.subText]}>last 30 days</Text>
            </View>

            <View style={styles.statsBox}>
              <Text style={[styles.text, { fontSize: 24 }]}>{totalCodeforcesSolved}</Text>
              <Text style={[styles.ext, styles.subText]}>total</Text>
            </View>
          </View>
          <View style={styles.pointsBox}>
            <View style={{ flex: 1, marginTop: 15 }}>
              <Text style={[styles.text, { fontSize: 24 }]}>Your Points</Text>
              <Text style={[styles.ext, styles.subText]}>
                +20 since last week
            </Text>
            </View>
            <Donut
              key={1}
              percentage={85}
              color={"skyblue"}
              delay={500 + 100 * 1}
              max={100}
            />

            <View
              style={[
                styles.OJContainer,
                { marginTop: 0, marginHorizontal: 20 },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="ellipse" color="skyblue" />
                <Text style={[styles.text, { fontWeight: "200" }]}>
                  Codeforces
              </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="ellipse" color="darkmagenta" />
                <Text style={[styles.text, { fontWeight: "200" }]}>
                  Codechef
              </Text>
              </View>
            </View>
          </View>
          <Button title="Sign Out" onPress={() => onLogout()} />

        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontFamily: "redhatdisplay-bold",
    color: "#52575D",
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  profileImage: {
    width: 170,
    height: 170,
    borderRadius: 100,
    overflow: "hidden",
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#34FF89",
    position: "absolute",
    bottom: 28,
    left: 5,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 100,
  },
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 25,
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  pointsBox: {
    margin: 30,
    backgroundColor: "white",
    height: 270,
    borderRadius: 40,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  pointsBoxContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  OJContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  donutText: {
    fontWeight: "900",
    textAlign: "center",
  },
  activitycontainer: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});