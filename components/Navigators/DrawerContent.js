import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, drawerItem } from "@react-navigation/drawer";

import firebase from "firebase";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function DrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={require("../../assets/Person/nayem.jpg")}
                size={50}
              />
              <View style={{ flexDirection: "column", marginLeft: 15 }}>
                <Title style={styles.title}>Abdullah Al Nayem</Title>
                <Caption style={styles.caption}>@whonayem01</Caption>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  1299
                </Paragraph>
                <Caption style={styles.caption}>Codeforces</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  1437
                </Paragraph>
                <Caption style={styles.caption}>CodeChef</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.bottomDrawerSection}>
            <Drawer.Item
              icon={({ color, size }) => (
                <Icon name="heart-outline" color={color} size={size} />
              )}
              label="Favorites"
              onPress={() => {props.navigation.navigate('Favorites')}}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <Feather name="award" color={color} size={size} />
              )}
              label="Badges"
              onPress={() => {props.navigation.navigate('Badges')}}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="alarm-outline" color={color} size={size} />
              )}
              label="Contest Reminder"
              onPress={() => {props.navigation.navigate('ContestReminder')}}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Blog"
              onPress={() => {props.navigation.navigate('Feed')}}
            />
          </Drawer.Section>
          <Drawer.Section style={styles.bottomDrawerSection2}>
            <Drawer.Item
              icon={({ color, size }) => (
                <Feather name="star" color={color} size={size} />
              )}
              label="Rate Us"
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <FontAwesome name="share" color={color} size={size} />
              )}
              label="Share with a friend"
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <Ionicons name="people-outline" color={color} size={size} />
              )}
              label="About Us"
              onPress={() => {props.navigation.navigate('AboutUs')}}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section>
        <Drawer.Item
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => firebase.auth().signOut()}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontFamily: "redhatdisplay-bold",
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginTop: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 2,
  },
  bottomDrawerSection2: {
    marginTop: -5,
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 2,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
