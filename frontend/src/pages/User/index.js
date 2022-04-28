import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Layout,
  Menu,
  Card,
  Select,
  Alert,
  Avatar,
  Button,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import modiji from "../../assets/Modiji.jpeg";
import getVaccinated from "../../assets/GetVaccinated.jpeg";
import "./index.css";

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { Title } = Typography;

const User = () => {
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };
  const onChange = (value) => {
    console.log(JSON.parse(value));
    setState({ ...state, current_center: JSON.parse(value) });
  };
  const onSlotChange = (value) => {
    setState({ ...state, current_slot: JSON.parse(value) });
  };
  const renderAlerts = () => {
    if (state.isVaccinated && state.nurse_id) {
      return (
        <Alert
          message="You are vaccinated"
          type="success"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      );
    } else if (state.nurse_id && !state.isVaccinated) {
      return (
        <Alert
          message="The Vaccine Centre has been alloted for you. Please visit the nearest vaccination centre to get vaccinated"
          type="warning"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      );
    } else {
      return (
        <Alert
          message="Please get Vaccinated!"
          type="warning"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.current_center && state.current_slot) {
      var axios = require("axios");
      var data = JSON.stringify({
        slotID: state.current_slot.id,
        vaccineCenterID: state.current_center.id,
      });

      var config = {
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}api/user/register-vaccination`,
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
    } else {
      console.log("bruh");
    }
  };
  const [state, setState] = useState({
    fname: "",
    lname: "",
    pincode: "",
    gender: "",
    phone_number: "",
    email: "",
    age: null,
    isVaccinated: false,
    loading: true,
    vaccine_centers: null,
    current_center: null,
    curent_slot: null,
    nurse_id: null,
  });
  const getUserProfileAndVaccineCenters = async () => {
    let config = {
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}api/user/profile`,
      headers: {
        Authorization:
          "Bearer " + (await sessionStorage.getItem("access_token")),
      },
    };

    axios(config)
      .then(async (resp) => {
        const {
          fname,
          lname,
          gender,
          pincode,
          phone_number,
          email,
          age,
          isVaccinated,
          nurse_id,
        } = resp.data.data;
        console.log(resp.data.data);
        setState(() => ({
          fname,
          lname,
          gender,
          pincode,
          phone_number,
          email,
          age,
          isVaccinated,
          loading: false,
          nurse_id,
        }));
      })
      .then(() => {
        axios
          .get(`${process.env.REACT_APP_SERVER_URL}api/vaccine-centers`)
          .then(async (response) => {
            setState((state) => ({
              ...state,
              vaccine_centers: response.data.data,
            }));
          });
      })
      .catch((e) => {
        setState({ ...state, loading: false });
        console.log(e);
      });
  };
  useEffect(() => {
    getUserProfileAndVaccineCenters();
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
                {state.fname}
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

        <Content style={{ padding: "0 50px", minHeight: "88vh" }}>
          <div className="site-layout-content" style={{ margin: "50px 0px" }}>
            {renderAlerts()}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                <Card
                  title="Choose Vaccine-Centre"
                  style={{ width: "300px" }}
                  className="select-before"
                >
                  <Select
                    defaultValue="Choose Centre"
                    onChange={onChange}
                    disabled={state.nurse_id ? true : false}
                  >
                    {state.vaccine_centers
                      ? state.vaccine_centers.map((center) => {
                          return (
                            <Option value={JSON.stringify(center)}>
                              {center.name}
                            </Option>
                          );
                        })
                      : ""}
                  </Select>
                </Card>
                <Card
                  title="Choose Slot-Timing"
                  style={{ width: 300, marginTop: "30px" }}
                  className="select-before"
                >
                  <Select
                    defaultValue="Choose Timing"
                    onChange={onSlotChange}
                    disabled={state.nurse_id ? true : false}
                  >
                    {state.current_center
                      ? state.current_center.slots.map((slot) => {
                          return (
                            <Option value={JSON.stringify(slot)}>
                              {slot.duration}
                            </Option>
                          );
                        })
                      : ""}
                  </Select>
                </Card>
              </div>
              <div>
                {state.nurse_id && state.isVaccinated ? (
                  <img src={modiji} alt="" />
                ) : (
                  <img src={getVaccinated} alt="" />
                )}
              </div>
            </div>
            <Button
              type="primary"
              style={{
                margin: "20px 10px",
              }}
              onClick={handleSubmit}
              disabled={state.nurse_id ? true : false}
            >
              Submit
            </Button>
            <div>
              <Title level={2} style={{ color: "black", margin: "5px 10px" }}>
                COVID-19 vaccines: everything you need to know
              </Title>
              <p>
                Now that COVID-19 vaccines have reached billions of people
                worldwide, the evidence is overwhelming that no matter which one
                you take, the vaccines offer life-saving protection against a
                disease that has killed millions. The pandemic is far from over,
                and they are our best bet of staying safe.
              </p>
            </div>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          DB-MINI-PROJ ©2021 Created by Mehul, Burhanuddin, Sarang
        </Footer>
      </Layout>
    </div>
  );
};

export default User;
