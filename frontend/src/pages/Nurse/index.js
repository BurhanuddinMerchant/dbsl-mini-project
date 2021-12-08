import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Select,
  Alert,
  Avatar,
  Button,
  Typography,
  message,
  Divider,
  Skeleton,
  List,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

import "./index.css";
import axios from "axios";
const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Nurse = () => {
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    name: "",
    gender: "",
    phone_number: "",
    email: "",
    slots: [],
    vaccineCenter: "",
    current_slot: null,
    users: [],
  });
  const getUsersToVaccinate = async () => {
    console.log(state);
    if (!state.current_slot) {
      return;
    }

    var config = {
      method: "get",
      url:
        "http://localhost:8000/api/nurse/users?slotID=" + state.current_slot.id,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify("*******", response.data));
        setState((state1) => ({ ...state1, users: response.data }));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getProfile = async () => {
    const config = {
      method: "get",
      url: "http://localhost:8000/api/nurse/profile",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token"),
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response.data.data);
        const { name, gender, phone_number, email, slots, vaccineCenter } =
          response.data.data;
        setState((state) => {
          return {
            ...state,
            name,
            gender,
            phone_number,
            email,
            slots,
            vaccineCenter,
            current_slot: slots.length > 0 ? slots[0] : null,
          };
        });
        console.log("get-users-to-vaccinate");

        console.log("get-users-to-vaccinate-after");
      })
      // .then(() => {})
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getUsersToVaccinate();
  }, [state.current_slot]);
  const toVaccinate = (e) => {
    console.log(e);
    // if (state.current_center && state.current_slot) {
    var axios = require("axios");
    var data = JSON.stringify({
      userID: e.id,
    });

    var config = {
      method: "patch",
      url: "http://localhost:8000/api/vaccinate",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    // } else {
    // console.log("bruh");
    // }
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                marginTop: "10px",
                display: "flex",
              }}
            >
              <Avatar size="large" icon={<UserOutlined />} />
              <Title level={4} style={{ color: "white", margin: "5px 10px" }}>
                {state.name}
              </Title>
            </div>
            <div style={{ width: "1000px" }}></div>
            <div></div>
            <div>
              <Button
                type="danger"
                style={{ marginTop: "15px" }}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </Menu>
        </Header>

        {state.users ? (
          <Content style={{ padding: "0 50px" }}>
            <div
              className="site-layout-content"
              style={{ margin: "50px 0px", minHeight: "76vh" }}
            >
              <div style={{ display: "flex" }}>
                <Title level={2}>
                  Vaccine Centre : {state.vaccineCenter.name}
                </Title>
              </div>
              <div
                id="scrollableDiv"
                style={{
                  height: 700,
                  overflow: "auto",
                  padding: "0 16px",
                  border: "1px solid rgba(140, 140, 140, 0.35)",
                }}
              >
                <InfiniteScroll
                  dataLength={data.length}
                  hasMore={data.length < 50}
                  endMessage={
                    <Divider plain>It is all, nothing more 🤐</Divider>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    dataSource={state.users}
                    itemLayout="horizontal"
                    renderItem={(item, i) => (
                      <List.Item key={i}>
                        <span>{i + 1}</span>
                        <List.Item.Meta
                          title={item.fname}
                          description={state.current_slot.duration}
                        />

                        <Button
                          onClick={() => toVaccinate(item)}
                          disabled={item.isVaccinated ? true : false}
                        >
                          Click here to Vaccinate
                        </Button>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </div>
          </Content>
        ) : (
          ""
        )}

        <Footer style={{ textAlign: "center" }}>
          DB-MINI-PROJ ©2021 Created by Mehul, Burhanuddin, Sarang
        </Footer>
      </Layout>
    </div>
  );
};

export default Nurse;
